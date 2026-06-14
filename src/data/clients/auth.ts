import { captureException } from '@sentry/react-native'
import axios from 'axios'
import {
  AuthRequest,
  exchangeCodeAsync,
  refreshAsync,
  TokenResponse,
} from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { useSyncExternalStore } from 'react'
import {
  apiBase,
  authClientId,
  authIssuer,
  authRedirect,
  authScopes,
} from '@/configuration'
import { isTokenError } from '@/data/clients/auth.errors'
import type { IdData } from '@/data/clients/auth.idToken'
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

export type AuthState = {
  isReady: boolean
  tokenResponse: TokenResponse | null
  isLoggedIn: boolean
  idData: IdData | null
  claims: EfClaims | null
  user: EfUser | null
}

/**
 * Auth client.
 */
export class AuthClient {
  /**
   * Auth state.
   * @private
   */
  private _state: AuthState = {
    isReady: false,
    tokenResponse: null,
    isLoggedIn: false,
    idData: null,
    claims: null,
    user: null,
  }

  /**
   * Handle to the refresh interval.
   * @private
   */
  private _refresher: any = null

  /**
   * Set of listeners.
   * @private
   */
  private _listeners = new Set<() => void>()

  /**
   * Gets the auth state.
   */
  get state(): Readonly<AuthState> {
    return this._state
  }

  /**
   * True if auth state is ready.
   */
  get isReady() {
    return this._state.isReady
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
   * Starts auth integration.
   */
  public start() {
    // Restore and notify. Then refresh initially and connect auto-refresh.
    this._restoreState()
      .then(() => this.refresh(true).catch(captureException))
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

      // Prompt, result is code to exchange.
      const codeResponse = await request.promptAsync(
        {
          authorizationEndpoint: `${authIssuer}/oauth2/auth`,
        },
        { showInRecents: true }
      )

      // If code failed, reset and return.
      if (codeResponse?.type !== 'success') {
        await this._resetStateAndNotify()
        return
      }

      // Exchange.
      const response = await exchangeCodeAsync(
        {
          clientId: authClientId,
          code: codeResponse.params.code,
          extraParams: request.codeVerifier
            ? { code_verifier: request.codeVerifier }
            : undefined,
          redirectUri: authRedirect,
        },
        {
          tokenEndpoint: `${authIssuer}/oauth2/token`,
        }
      )

      // Store exchanged response.
      await this._setStateAndNotify(response)
    } catch (error) {
      // Token has an error, reset state.
      if (isTokenError(error)) {
        await this._resetStateAndNotify()
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
      if (!this._state.tokenResponse) return

      // Nothing to refresh.
      if (!this._state.tokenResponse.refreshToken) return
      // Unforced and still fresh.
      if (
        !(force || !TokenResponse.isTokenFresh(this._state.tokenResponse, 300))
      )
        return

      // Refresh with the current token.
      const refreshResponse = await refreshAsync(
        {
          clientId: authClientId,
          scopes: authScopes,
          refreshToken: this._state.tokenResponse.refreshToken,
        },
        {
          tokenEndpoint: `${authIssuer}/oauth2/token`,
        }
      )

      // Update response.
      await this._setStateAndNotify(refreshResponse)
    } catch (error) {
      // Token has an error, reset state.
      if (isTokenError(error)) {
        await this._resetStateAndNotify()
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
    if (!this._state.tokenResponse) return

    // Revoke access token.
    if (this._state.tokenResponse.accessToken)
      await axios
        .post(
          `${authIssuer}/oauth2/revoke`,
          new URLSearchParams({
            token: this._state.tokenResponse.accessToken,
            client_id: authClientId,
            token_type_hint: 'access_token',
          })
        )
        .catch(captureException)

    // Revoke refresh token.
    if (this._state.tokenResponse.refreshToken)
      await axios
        .post(
          `${authIssuer}/oauth2/revoke`,
          new URLSearchParams({
            token: this._state.tokenResponse.refreshToken,
            client_id: authClientId,
            token_type_hint: 'refresh_token',
          })
        )
        .catch(captureException)

    // Clear data.
    await this._resetStateAndNotify()
  }

  /**
   * Sets the state and refreshes user info and user API data from the given
   * response. Notifies the listeners.
   * @param response The response to use for state and fetching additional data.
   * @private
   */
  private async _setStateAndNotify(response: TokenResponse) {
    const fetchUserInfoPromise = AuthClient._fetchUserInfo(response.accessToken)
    const fetchUserSelfPromise = AuthClient._fetchUserSelf(response.accessToken)
    this._state = {
      isReady: true,
      tokenResponse: response,
      isLoggedIn: Boolean(response),
      idData: parseIdToken(response.idToken),
      claims: await fetchUserInfoPromise,
      user: await fetchUserSelfPromise,
    }
    await this._saveState()
    this._notify()
  }

  /**
   * Sets the state to null and resets dependent data. Notifies the listeners.
   * @private
   */
  private async _resetStateAndNotify() {
    this._state = {
      isReady: true,
      tokenResponse: null,
      isLoggedIn: false,
      idData: null,
      claims: null,
      user: null,
    }
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
      this._state = {
        isReady: true,
        tokenResponse: null,
        isLoggedIn: false,
        idData: null,
        claims: null,
        user: null,
      }
      this._notify()
    } else {
      try {
        const data = JSON.parse(stored)
        this._state = {
          isReady: true,
          tokenResponse: data.tokenResponse,
          isLoggedIn: Boolean(data.tokenResponse),
          idData: data.idData,
          claims: data.claims,
          user: data.user,
        }
        this._notify()
      } catch {
        this._state = {
          isReady: true,
          tokenResponse: null,
          isLoggedIn: false,
          idData: null,
          claims: null,
          user: null,
        }
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
          tokenResponse: this._state.tokenResponse,
          idData: this._state.idData,
          claims: this._state.claims,
          user: this._state.user,
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
  private static async _fetchUserInfo(accessToken: string | null) {
    if (!accessToken) return null
    return await axios
      .get(`${authIssuer}/api/v1/userinfo`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
  private static async _fetchUserSelf(accessToken: string | null) {
    if (!accessToken) return null
    return await axios
      .get(`${apiBase}/Users/:self`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
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
 * Stable wrapper binding auth subscription.
 * @param listener The listener to add. Returns unsubscription.
 */
function authSubscribe(listener: () => void) {
  return auth.subscribe(listener)
}

/**
 * Stable wrapper binding auth state.
 */
function authGetSnapshot() {
  return auth.state
}

/**
 * Uses the auth client state, i.e., the token and ID data, as well as claims and API user data.
 */
export function useAuthState() {
  return useSyncExternalStore(authSubscribe, authGetSnapshot, authGetSnapshot)
}
