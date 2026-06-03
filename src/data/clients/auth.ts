import { captureException } from '@sentry/react-native'
import axios from 'axios'
import { AuthRequest, refreshAsync, TokenResponse } from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { useSyncExternalStore } from 'react'
import {
  apiBase,
  authClientId,
  authIssuer,
  authRedirect,
  authScopes,
} from '@/configuration'
import type { IdData } from '@/context/auth/Auth.idToken'
import { isTokenError } from '@/data/clients/auth.errors'
import { parseIdToken } from '@/data/clients/auth.idToken'
import type { EfClaims } from '@/data/types/EfClaims'
import type { EfUser } from '@/data/types/EfUser'
import * as AsyncStorage from '@/util/asyncStorage'

/**
 * Finishes auth session completions for web.
 */
export function finishLoginRedirect() {
  WebBrowser.maybeCompleteAuthSession()
}

/**
 * Auth client.
 */
export class AuthClient {
  /**
   * Stored token response.
   * @private
   */
  private _tokenResponse: TokenResponse | null = null

  /**
   * Stored ID data.
   * @private
   */
  private _idData: IdData | null = null

  /**
   * Stored user claims.
   * @private
   */
  private _userClaims: EfClaims | null = null

  /**
   * Stored API user data.
   * @private
   */
  private _userData: EfUser | null = null

  /**
   * Handle to the refresh interval.
   * @private
   */
  private _refresher: any = null

  /**
   * Set to true when ready.
   * @private
   */
  private _isReady: boolean = false

  /**
   * Set of listeners.
   * @private
   */
  private _listeners = new Set<() => void>()

  constructor() {
    // Restore and notify. Then refresh initially and connect auto-refresh.
    this._restoreState()
      .then(() => this.refresh().catch(captureException))
      .then(() => {
        // Finally, start timer. Lock once.
        let running = false
        this._refresher = setInterval(() => {
          // Already running, skip.
          if (running) return

          // Mark running and refresh.
          running = true
          this.refresh(false)
            .catch(captureException)
            .finally(() => {
              running = false
            })
        }, 600_000)
      })
  }

  /**
   * Token data with access, refresh, ID tokens.
   */
  get tokenResponse() {
    return this._tokenResponse
  }

  /**
   * Parsed ID data.
   */
  get idData() {
    return this._idData
  }

  /**
   * Claims set.
   */
  get userClaims() {
    return this._userClaims
  }

  /**
   * App API user data.
   */
  get userData() {
    return this._userData
  }

  /**
   * True if auth state is ready.
   */
  get isReady() {
    return this._isReady
  }

  /**
   * Subscribe a listener to changes.
   * @param listener The listener to invoke.
   */
  public subscribe(listener: () => void): () => void {
    this._listeners.add(listener)
    return () => this._listeners.delete(listener)
  }

  /**
   * Stops the refresh interval.
   */
  public stop() {
    // Clear if not null, then reset.
    if (this._refresher != null) clearInterval(this._refresher)
    this._refresher = null
  }

  /**
   * Prompts for login.
   * @remarks Saves state and notifies.
   */
  public async login() {
    try {
      // Build request.
      const request = new AuthRequest({
        clientId: authClientId,
        scopes: authScopes,
        redirectUri: authRedirect,
      })

      // Prompt.
      const response = await request.promptAsync(
        {
          authorizationEndpoint: `${authIssuer}/oauth2/auth`,
        },
        { showInRecents: true }
      )

      // If OK, parse response and save state.
      if (response.type === 'success') {
        this._tokenResponse = response.authentication
        this._idData = parseIdToken(response.authentication?.idToken)
        this._userClaims = await this._fetchUserInfo()
        this._userData = await this._fetchUserSelf()
        await this._saveState()
        this._notify()
      }
    } catch (error) {
      // Token has an error, reset state.
      if (isTokenError(error)) {
        this._tokenResponse = null
        this._idData = null
        this._userClaims = null
        this._userData = null
        await this._saveState()
        this._notify()
      }
      throw error
    }
  }

  /**
   * Refreshes the current token.
   * @param force If true, does not check if the token is still considered fresh.
   * @remarks Saves state and notifies.
   */
  public async refresh(force?: boolean) {
    try {
      // Get token response. If nothing to revoke, skip.
      if (!this._tokenResponse) return

      // Nothing to refresh.
      if (!this._tokenResponse.refreshToken) return
      // Unforced and still fresh.
      if (!(force || !TokenResponse.isTokenFresh(this._tokenResponse, 300)))
        return

      // Refresh with the current token.
      const refreshResponse = await refreshAsync(
        {
          clientId: authClientId,
          scopes: authScopes,
          refreshToken: this._tokenResponse.refreshToken,
        },
        {
          tokenEndpoint: `${authIssuer}/oauth2/token`,
        }
      )

      // Update response.
      this._tokenResponse = refreshResponse
      this._idData = parseIdToken(refreshResponse?.idToken)
      this._userClaims = await this._fetchUserInfo()
      this._userData = await this._fetchUserSelf()
      await this._saveState()
      this._notify()
    } catch (error) {
      // Token has an error, reset state.
      if (isTokenError(error)) {
        this._tokenResponse = null
        this._idData = null
        this._userClaims = null
        this._userData = null
        await this._saveState()
        this._notify()
      }
      throw error
    }
  }

  /**
   * Revokes tokens and resets state.
   * @remarks Saves state and notifies.
   * @throws never Upstream errors are consumed.
   */
  public async logout() {
    // Get token response. If nothing to revoke, skip.
    if (!this._tokenResponse) return

    // Revoke access token.
    if (this._tokenResponse.accessToken)
      await axios
        .post(
          `${authIssuer}/oauth2/revoke`,
          new URLSearchParams({
            token: this._tokenResponse.accessToken,
            client_id: authClientId,
            token_type_hint: 'access_token',
          })
        )
        .catch(captureException)

    // Revoke refresh token.
    if (this._tokenResponse.refreshToken)
      await axios
        .post(
          `${authIssuer}/oauth2/revoke`,
          new URLSearchParams({
            token: this._tokenResponse.refreshToken,
            client_id: authClientId,
            token_type_hint: 'refresh_token',
          })
        )
        .catch(captureException)

    // Clear data.
    this._tokenResponse = null
    this._idData = null
    this._userClaims = null
    this._userData = null
    await this._saveState()
    this._notify()
  }

  /**
   * Restores the saved state.
   * @throws never
   * @private
   */
  private async _restoreState() {
    const stored = await AsyncStorage.get('auth-client-persisted-state')
    if (stored === null) {
      this._tokenResponse = null
      this._idData = null
      this._userClaims = null
      this._userData = null
      this._notify()
    } else {
      try {
        const data = JSON.parse(stored)
        this._tokenResponse = data.tokenResponse
        this._idData = data.idData
        this._userClaims = data.userClaims
        this._userData = data.userData
        this._notify()
      } catch {
        this._tokenResponse = null
        this._idData = null
        this._userClaims = null
        this._userData = null
        this._notify()
        await AsyncStorage.remove('auth-client-persisted-state')
      }
    }
  }

  /**
   * Saves the current state.
   * @throws never
   * @private
   */
  private async _saveState() {
    try {
      await AsyncStorage.set(
        'auth-client-persisted-state',
        JSON.stringify({
          tokenResponse: this._tokenResponse,
          idData: this._idData,
          userClaims: this._userClaims,
          userData: this._userData,
        })
      )
    } catch (error) {
      console.warn('Error saving auth client state', error)
    }
  }

  /**
   * Fetches user info, returns null if failed or no token.
   * @throws never
   * @private
   */
  private async _fetchUserInfo() {
    if (!this._tokenResponse?.accessToken) return null
    return await axios
      .get(`${authIssuer}/api/v1/userinfo`, {
        headers: {
          Authorization: `Bearer ${this._tokenResponse?.accessToken}`,
        },
      })
      .then((res) => res.data as EfClaims)
      .catch((error) => {
        captureException(error)
        return null
      })
  }

  /**
   * Fetches user self data, returns null if failed or no token.
   * @throws never
   * @private
   */
  private async _fetchUserSelf() {
    if (!this._tokenResponse?.accessToken) return null
    return await axios
      .get(`${apiBase}/Users/:self`, {
        headers: {
          Authorization: `Bearer ${this._tokenResponse?.accessToken}`,
        },
      })
      .then((res) => res.data as EfUser)
      .catch((error) => {
        captureException(error)
        return null
      })
  }

  /**
   * Notify all listeners that the state has changed.
   * @throws never
   * @private
   */
  private _notify() {
    // Mark ready true, if not already set.
    this._isReady = true

    // Notify listeners.
    for (const listener of this._listeners) {
      try {
        listener()
      } catch (error) {
        // Do not handle listener failures.
        console.error('Unhandled AuthClient listener error', error)
      }
    }
  }
}

/**
 * Global auth client instance.
 */
export const auth = new AuthClient()

/**
 * Uses the auth client state, i.e., the token and ID data, as well as claims and API user data.
 */
export function useAuthState() {
  return useSyncExternalStore(auth.subscribe, () => ({
    isReady: auth.isReady,
    tokenResponse: auth.tokenResponse,
    idData: auth.idData,
    userClaims: auth.userClaims,
    userData: auth.userData,
  }))
}
