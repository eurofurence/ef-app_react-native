import { exchangeCodeAsync, refreshAsync, TokenResponse, TokenResponseConfig, useAuthRequest } from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'

import * as SecureStore from '@/util/secureStorage'
import { authClientId, authIssuer, authRedirect, authScopes } from '@/configuration'
import { useAsyncInterval } from '@/hooks/util/useAsyncInterval'
import { useAsyncCallbackOnce } from '@/hooks/util/useAsyncCallbackOnce'
import { captureException } from '@sentry/react-native'
import axios, { AxiosError } from 'axios'

/**
 * Discovery entries.
 */
const discovery = {
  authorizationEndpoint: `${authIssuer}/oauth2/auth`,
  tokenEndpoint: `${authIssuer}/oauth2/token`,
  userInfoEndpoint: `${authIssuer}/api/v1/userinfo`,
  revocationEndpoint: `${authIssuer}/oauth2/revoke`,
}

/**
 * Interval between full refreshes.
 */
const refreshTokensAndClaimsInterval = 4800_000

/**
 * Interval between user claim refreshes.
 */
const refreshClaimsInterval = 600_000

/**
 * When to start requesting a new token.
 */
const refreshMarginSeconds = 600

/**
 * User claims record.
 */
export type Claims = Record<string, string | string[]>

/**
 * Checks if the status code indicates unauthorized or not allowed.
 * @param status The status to check.
 */
function isUnauthorized(status: number | undefined) {
  return status === 401 || status === 403
}

/**
 * Auth context type.
 */
export type AuthContextType = {
  /**
   * The last token response.
   */
  tokenResponse: TokenResponse | null

  /**
   * Shorthand for getting the `tokenResponse` access token.
   */
  accessToken: string | null

  /**
   * Shorthand for checking if `accessToken` is not null.
   */
  loggedIn: boolean

  /**
   * Current claims. May be `null` even if access token is present.
   */
  claims: Claims | null

  /**
   * Performs a login. Ignores logged in state.
   */
  login(responseConfig?: TokenResponseConfig): Promise<void>

  /**
   * Refreshes the claims. Returns true if refreshed (not necessarily changed).
   */
  refreshClaims(): Promise<boolean>

  /**
   * Refreshes the token and the claims. Returns true if refreshed (not
   * necessarily changed).
   */
  refreshTokensAndClaims(force?: boolean): Promise<boolean>

  /**
   * Revokes the tokens and performs a logout.
   */
  logout(): Promise<void>
}

/**
 * Gets the last stored token response.
 */
export async function getLastTokenResponse() {
  const tokenData = await SecureStore.getItemAsync('tokenData')
  return tokenData ? new TokenResponse(JSON.parse(tokenData)) : null
}

/**
 * Auth context.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined)
AuthContext.displayName = 'AuthContext'

// Link browser closing.
WebBrowser.maybeCompleteAuthSession()

/**
 * Provides auth state.
 * @param children The children to provide to.
 * @constructor
 */
export const AuthProvider = ({ children }: { children?: ReactNode | undefined }) => {
  const [tokenResponse, setTokenResponse] = useState<TokenResponse | null>(undefined as any)
  const [claims, setClaims] = useState<Claims | null>(undefined as any)
  const initialized = tokenResponse !== undefined && claims !== undefined

  // Auth request and login prompt.
  const [request, , promptAsync] = useAuthRequest(
    {
      clientId: authClientId,
      scopes: authScopes,
      redirectUri: authRedirect,
    },
    discovery
  )

  const login = useAsyncCallbackOnce(
    useCallback(
      async (responseConfig?: TokenResponseConfig) => {
        try {
          // Might have given token data, otherwise prompt for it.
          let response: TokenResponse
          if (responseConfig) {
            // Initialize with given data.
            response = new TokenResponse(responseConfig)
          } else {
            // We set show in "recents" so the web browser doesn't close when
            // you use an MFA method that requires switching apps on android.
            const codeResponse = await promptAsync({ showInRecents: true })

            // No request available, or the response is not successful.
            if (!request || codeResponse?.type !== 'success') return

            // Exchange response code.
            response = await exchangeCodeAsync(
              {
                clientId: authClientId,
                code: codeResponse.params.code,
                extraParams: request.codeVerifier ? { code_verifier: request.codeVerifier } : undefined,
                redirectUri: authRedirect,
              },
              discovery
            )
          }

          // Save token data and set in state.
          await SecureStore.setItemAsync('tokenData', JSON.stringify(response.getRequestConfig()))
          setTokenResponse(response)

          // Get claims, save and set in state.
          const claimsResponse = await axios.get(discovery.userInfoEndpoint, { headers: { Authorization: `Bearer ${response.accessToken}` } })
          const claims = claimsResponse.data
          await SecureStore.setItemAsync('claims', JSON.stringify(claims))
          setClaims(claims)
        } catch (error) {
          // If an auth error occurred, reset the state.
          if (error instanceof AxiosError && isUnauthorized(error.status)) {
            await SecureStore.deleteItemAsync('tokenData')
            await SecureStore.deleteItemAsync('claims')
            setTokenResponse(null)
            setClaims(null)
          }
          throw error
        }
      },
      [promptAsync, request]
    )
  )

  const refreshClaims = useAsyncCallbackOnce(
    useCallback(async () => {
      try {
        // Get the current token state.
        const tokenData = await SecureStore.getItemAsync('tokenData')
        const response = tokenData ? new TokenResponse(JSON.parse(tokenData)) : null

        // If no access token is available, this method returns false as the
        // requested operation is not actionable.
        if (!response?.accessToken) {
          return false
        }

        // Get claims, save and set in state.
        const claimsResponse = await axios.get(discovery.userInfoEndpoint, { headers: { Authorization: `Bearer ${response.accessToken}` } })
        const claims = claimsResponse.data
        await SecureStore.setItemAsync('claims', JSON.stringify(claims))
        setClaims(claims)
        return true
      } catch (error) {
        // If an auth error occurred, reset the state.
        if (error instanceof AxiosError && isUnauthorized(error.status)) {
          await SecureStore.deleteItemAsync('tokenData')
          await SecureStore.deleteItemAsync('claims')
          setTokenResponse(null)
          setClaims(null)
        }
        throw error
      }
    }, [])
  )

  const refreshTokensAndClaims = useAsyncCallbackOnce(
    useCallback(async (force?: boolean) => {
      try {
        // Get the current token state.
        const tokenData = await SecureStore.getItemAsync('tokenData')
        const response = tokenData ? new TokenResponse(JSON.parse(tokenData)) : null

        // If no refresh token is available, this method returns false as the
        // requested operation is not actionable.
        if (!response?.refreshToken) {
          return false
        }

        // Token is still fresh, not actionable.
        if (!force && TokenResponse.isTokenFresh(response, refreshMarginSeconds)) {
          return false
        }

        // Refresh.
        const refreshResponse = await refreshAsync(
          {
            clientId: authClientId,
            scopes: authScopes,
            refreshToken: response.refreshToken,
          },
          discovery
        )

        // Save new token data and set in state.
        await SecureStore.setItemAsync('tokenData', JSON.stringify(refreshResponse.getRequestConfig()))
        setTokenResponse(refreshResponse)

        // Get claims, set in state.
        const claimsResponse = await axios.get(discovery.userInfoEndpoint, { headers: { Authorization: `Bearer ${refreshResponse.accessToken}` } })
        const claims = claimsResponse.data
        await SecureStore.setItemAsync('claims', JSON.stringify(claims))
        setClaims(claims)
        return true
      } catch (error) {
        // If an auth error occurred, reset the state.
        if (error instanceof AxiosError && isUnauthorized(error.status)) {
          await SecureStore.deleteItemAsync('tokenData')
          await SecureStore.deleteItemAsync('claims')
          setTokenResponse(null)
          setClaims(null)
        }
        throw error
      }
    }, [])
  )

  const logout = useAsyncCallbackOnce(
    useCallback(async () => {
      // Get the current token state.
      const tokenData = await SecureStore.getItemAsync('tokenData')
      const response = tokenData ? new TokenResponse(JSON.parse(tokenData)) : null

      // Revoke any tokens that were found.
      if (response?.accessToken)
        await axios
          .post(
            discovery.revocationEndpoint,
            new URLSearchParams({
              token: response.accessToken,
              client_id: authClientId,
              token_type_hint: 'access_token',
            })
          )
          .catch(captureException)

      if (response?.refreshToken)
        await axios
          .post(
            discovery.revocationEndpoint,
            new URLSearchParams({
              token: response.refreshToken,
              client_id: authClientId,
              token_type_hint: 'refresh_token',
            })
          )
          .catch(captureException)

      // Always delete state and clear variables.
      await SecureStore.deleteItemAsync('tokenData')
      setTokenResponse(null)
      setClaims(null)
    }, [])
  )

  // Mount and unmount effect.
  useEffect(() => {
    // Warmup the browser to handle login requests.
    WebBrowser.warmUpAsync().catch(captureException)

    // Fire off getting the saved state.
    ;(async () => {
      const tokenData = await SecureStore.getItemAsync('tokenData')
      const response = tokenData ? new TokenResponse(JSON.parse(tokenData)) : null

      const claimsData = await SecureStore.getItemAsync('claims')
      const claims = claimsData ? JSON.parse(claimsData) : null

      setTokenResponse(response)
      setClaims(claims)
    })().catch(captureException)

    // On unmount, release browser.
    return () => {
      WebBrowser.coolDownAsync().catch(captureException)
    }
  }, [])

  // Recurrence to refresh claim data.
  useAsyncInterval(
    useCallback(
      async (_) => {
        if (!initialized) return
        await refreshClaims().catch(captureException)
      },
      [initialized, refreshClaims]
    ),
    refreshClaimsInterval
  )

  // Recurrence to refresh token and claim data.
  useAsyncInterval(
    useCallback(
      async (_) => {
        if (!initialized) return
        await refreshTokensAndClaims().catch(captureException)
      },
      [initialized, refreshTokensAndClaims]
    ),
    refreshTokensAndClaimsInterval
  )

  // Get value to provide to the children.
  const value = useMemo<AuthContextType>(() => {
    const accessToken = tokenResponse ? tokenResponse.accessToken : null
    const loggedIn = accessToken !== null
    return {
      tokenResponse,
      accessToken,
      loggedIn,
      claims,
      login,
      refreshClaims,
      refreshTokensAndClaims,
      logout,
    }
  }, [claims, login, logout, refreshClaims, refreshTokensAndClaims, tokenResponse])

  if (!initialized) return null
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Uses the auth context.
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuthContext must be used within a AuthProvider')
  return context
}
