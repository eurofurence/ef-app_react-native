import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware/persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthRequest, refreshAsync, TokenResponse } from 'expo-auth-session'
import { authClientId, authIssuer, authRedirect, authScopes } from '@/configuration'
import type { IdData } from '@/context/auth/Auth.idToken'
import { parseIdToken } from '@/data/clients/auth.idToken'
import axios from 'axios'
import { isTokenError } from '@/data/clients/auth.errors'
import { captureException } from '@sentry/react-native'

export interface AuthState {
  /**
   * Token data with access, refresh, ID tokens.
   */
  tokenResponse: TokenResponse | null

  /**
   * Parsed ID data.
   */
  idData: IdData | null

  /**
   * Prompts for login.
   */
  login(): Promise<void>

  /**
   * Refreshes the current token.
   * @param force If true, does not check if the token is still considered fresh.
   */
  refresh(force?: boolean): Promise<void>

  /**
   * Revokes tokens and resets state.
   */
  logout(): Promise<void>
}

/**
 * Authentication state.
 */
export const useAuthStore = create(persist<AuthState>((set, get) => ({
  tokenResponse: null,
  idData: null,

  async login() {
    try {
      // Build request.
      const request = new AuthRequest({
        clientId: authClientId,
        scopes: authScopes,
        redirectUri: authRedirect,
      })

      // Prompt.
      const response = await request.promptAsync({
        authorizationEndpoint: `${authIssuer}/oauth2/auth`,
      }, { showInRecents: true })

      // If OK, parse response and saave state.
      if (response.type === 'success') {
        set({
          tokenResponse: response.authentication,
          idData: response.authentication?.idToken ? parseIdToken(response.authentication.idToken) : null,
        })
      }
    } catch (error) {
      // Token has an error, reset state.
      if (isTokenError(error)) {
        set({
          tokenResponse: null,
          idData: null,
        })
      }
      throw error
    }
  },

  async refresh(force?: boolean) {
    try {
      // Get token response. If nothing to revoke, skip.
      const { tokenResponse } = get()
      if (!tokenResponse) return

      // Nothing to refresh.
      if (!tokenResponse.refreshToken) return
      // Unforced and still fresh.
      if (!(force || !TokenResponse.isTokenFresh(tokenResponse, 300))) return

      // Refresh with the current token.
      const refreshResponse = await refreshAsync(
        {
          clientId: authClientId,
          scopes: authScopes,
          refreshToken: tokenResponse.refreshToken,
        },
        {
          tokenEndpoint: `${authIssuer}/oauth2/token`,
        },
      )

      // Update response.
      set({
        tokenResponse: refreshResponse,
        idData: refreshResponse?.idToken ? parseIdToken(refreshResponse.idToken) : null,
      })
    } catch (error) {
      // Token has an error, reset state.
      if (isTokenError(error)) {
        set({
          tokenResponse: null,
          idData: null,
        })
      }
    }
  },

  async logout() {
    // Get token response. If nothing to revoke, skip.
    const { tokenResponse } = get()
    if (!tokenResponse) return

    // Revoke access token.
    if (tokenResponse.accessToken)
      await axios.post(
        `${authIssuer}/oauth2/revoke`,
        new URLSearchParams({
          token: tokenResponse.accessToken,
          client_id: authClientId,
          token_type_hint: 'access_token',
        }),
      ).catch(captureException)

    // Revoke refresh token.
    if (tokenResponse.refreshToken)
      await axios.post(
        `${authIssuer}/oauth2/revoke`,
        new URLSearchParams({
          token: tokenResponse.refreshToken,
          client_id: authClientId,
          token_type_hint: 'refresh_token',
        }),
      ).catch(captureException)

    // Clear data.
    set({
      tokenResponse: null,
      idData: null,
    })
  },
}), {
  name: 'auth',
  storage: createJSONStorage(() => AsyncStorage),
}))

// Connect refreshing the token to state.
useAuthStore.persist.onFinishHydration(() => {
  // Lock once.
  let running = false

  // Start refresh interval.
  const interval = setInterval(() => {
    // Already running, skip.
    if (running) return

    // Mark running and refresh.
    running = true
    useAuthStore.getState().refresh(false).catch(captureException)
      .finally(() => {
        running = false
      })
  }, 600_000)

  return () => {
    clearInterval(interval)
  }
})


