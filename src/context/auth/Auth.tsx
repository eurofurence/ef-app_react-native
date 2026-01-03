import { captureException } from '@sentry/react-native'
import axios from 'axios'
import {
  exchangeCodeAsync,
  refreshAsync,
  TokenResponse,
  type TokenResponseConfig,
  useAuthRequest,
} from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { Platform } from 'react-native'

import {
  authClientId,
  authIssuer,
  authRedirect,
  authScopes,
} from '@/configuration'
import { isTokenError } from '@/context/auth/Auth.errors'
import { type IdData, parseIdToken } from '@/context/auth/Auth.idToken'
import { useAsyncCallbackOnce } from '@/hooks/util/useAsyncCallbackOnce'
import { useAsyncInterval } from '@/hooks/util/useAsyncInterval'
import * as SecureStore from '@/util/secureStorage'

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
   * Shorthand for parsing the `tokenResponse` ID token.
   */
  idData: IdData | null

  /**
   * Shorthand for checking if `accessToken` is not null.
   */
  loggedIn: boolean

  /**
   * Loads the token response, validates it and refreshes it if it's within the refresh margin.
   * @param data The response config to load.
   */
  load(data: TokenResponseConfig): Promise<void>

  /**
   * Performs a login. Returns false if not actionable.
   */
  login(): Promise<void>

  /**
   * Refreshes the token. Returns false if not actionable.
   */
  refreshToken(force?: boolean): Promise<void>

  /**
   * Revokes the tokens and resets the state. Returns false if not actionable.
   */
  logout(): Promise<void>
}

export const storageKeyTokenResponse = 'tokenResponseConfig'

/**
 * Gets the last stored token response.
 */
export async function getLastTokenResponse() {
  const tokenData = await SecureStore.getItemAsync(storageKeyTokenResponse)
  return tokenData ? new TokenResponse(JSON.parse(tokenData)) : null
}

/**
 * Auth context.
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined)
AuthContext.displayName = 'AuthContext'

/**
 * Finishes auth session completions for web.7
 */
export function finishLoginRedirect() {
  WebBrowser.maybeCompleteAuthSession()
}

/**
 * Provides auth state.
 * @param children The children to provide to.
 * @constructor
 */
export const AuthProvider = ({
  children,
}: {
  children?: ReactNode | undefined
}) => {
  const [tokenResponse, setTokenResponse] = useState<TokenResponse | null>(
    undefined as any
  )
  const initialized = tokenResponse !== undefined

  // Auth request and login prompt.
  const [request, , promptAsync] = useAuthRequest(
    {
      clientId: authClientId,
      scopes: authScopes,
      redirectUri: authRedirect,
    },
    discovery
  )

  const load = useAsyncCallbackOnce(
    useCallback(async (data: TokenResponseConfig) => {
      try {
        // Load the data.
        const loadResponse = new TokenResponse(data)

        // Check if the token should be refreshed.
        if (!TokenResponse.isTokenFresh(loadResponse, 300)) {
          // Should be refreshed, but we also need a refresh token to do that.
          if (loadResponse.refreshToken) {
            // Refresh with the given token.
            const refreshResponse = await refreshAsync(
              {
                clientId: authClientId,
                scopes: authScopes,
                refreshToken: loadResponse.refreshToken,
              },
              discovery
            )

            // Set the refreshed token instead.
            await SecureStore.setItemAsync(
              storageKeyTokenResponse,
              JSON.stringify(refreshResponse.getRequestConfig())
            )
            setTokenResponse(refreshResponse)
          } else {
            // Set expiring token, cannot refresh, but it's still valid for a bit.
            await SecureStore.setItemAsync(
              storageKeyTokenResponse,
              JSON.stringify(loadResponse.getRequestConfig())
            )
            setTokenResponse(loadResponse)
          }
        } else {
          // Set loaded token, it's OK.
          await SecureStore.setItemAsync(
            storageKeyTokenResponse,
            JSON.stringify(loadResponse.getRequestConfig())
          )
          setTokenResponse(loadResponse)
        }
      } catch (error) {
        // If the error indicates an invalid token, clear the token data.
        if (isTokenError(error)) {
          await SecureStore.deleteItemAsync(storageKeyTokenResponse)
          setTokenResponse(null)
        }
        throw error
      }
    }, [])
  )

  const login = useAsyncCallbackOnce(
    useCallback(async () => {
      try {
        // We set show in "recents" so the web browser doesn't close when
        // you use an MFA method that requires switching apps on android.
        const codeResponse = await promptAsync({ showInRecents: true })

        // No request available, or the response is not successful.
        if (!request || codeResponse?.type !== 'success') return

        // Exchange response code.
        const response = await exchangeCodeAsync(
          {
            clientId: authClientId,
            code: codeResponse.params.code,
            extraParams: request.codeVerifier
              ? { code_verifier: request.codeVerifier }
              : undefined,
            redirectUri: authRedirect,
          },
          discovery
        )

        // Save token data and set in state.
        await SecureStore.setItemAsync(
          storageKeyTokenResponse,
          JSON.stringify(response.getRequestConfig())
        )
        setTokenResponse(response)
      } catch (error) {
        // If the error indicates an invalid token, clear the token data.
        if (isTokenError(error)) {
          await SecureStore.deleteItemAsync(storageKeyTokenResponse)
          setTokenResponse(null)
        }
        throw error
      }
    }, [promptAsync, request])
  )

  const refreshToken = useAsyncCallbackOnce(
    useCallback(async (force?: boolean) => {
      try {
        // Get from secure store.
        const tokenResponse = await getLastTokenResponse()

        // Must have a refresh token.
        if (!tokenResponse?.refreshToken) {
          // No refresh token available, just return early
          return
        }

        // Token is still fresh, not actionable.
        if (!(force || !TokenResponse.isTokenFresh(tokenResponse, 300))) {
          return
        }

        // Refresh with the current token.
        const refreshResponse = await refreshAsync(
          {
            clientId: authClientId,
            scopes: authScopes,
            refreshToken: tokenResponse.refreshToken,
          },
          discovery
        )

        // Set the refreshed token.
        await SecureStore.setItemAsync(
          storageKeyTokenResponse,
          JSON.stringify(refreshResponse.getRequestConfig())
        )
        setTokenResponse(refreshResponse)
      } catch (error) {
        // If the error indicates an invalid token, clear the token data.
        if (isTokenError(error)) {
          await SecureStore.deleteItemAsync(storageKeyTokenResponse)
          setTokenResponse(null)
        }
        throw error
      }
    }, [])
  )

  const logout = useAsyncCallbackOnce(
    useCallback(async () => {
      // Get from secure store.
      const tokenResponse = await getLastTokenResponse()

      // If access token exists, revoke it.
      if (tokenResponse?.accessToken)
        await axios
          .post(
            discovery.revocationEndpoint,
            new URLSearchParams({
              token: tokenResponse.accessToken,
              client_id: authClientId,
              token_type_hint: 'access_token',
            })
          )
          .catch(captureException)

      // If refresh token exists, revoke it.
      if (tokenResponse?.refreshToken)
        await axios
          .post(
            discovery.revocationEndpoint,
            new URLSearchParams({
              token: tokenResponse.refreshToken,
              client_id: authClientId,
              token_type_hint: 'refresh_token',
            })
          )
          .catch(captureException)

      // Always delete state and clear variables.
      await SecureStore.deleteItemAsync(storageKeyTokenResponse)
      setTokenResponse(null)
    }, [])
  )

  // Mount and unmount effect.
  useEffect(() => {
    // Warmup the browser to handle login requests.
    if (Platform.OS !== 'web') {
      WebBrowser.warmUpAsync().catch(() => {
        return
      })
    }
    // Fire off loading the state.
    ;(async () => {
      const tokenData = await SecureStore.getItemAsync(storageKeyTokenResponse)
      if (tokenData) {
        await load(JSON.parse(tokenData))
      } else {
        setTokenResponse(null)
      }
    })().catch(captureException)

    // On unmount, release browser.
    return () => {
      if (Platform.OS !== 'web') {
        WebBrowser.coolDownAsync().catch(() => {
          return
        })
      }
    }
  }, [load])

  // Try refreshing the access token every ten minutes. Token expiry will be around an hour, so
  // this gives us ample time between expiry and the 'fresh' margin.
  useAsyncInterval(
    useCallback(
      () =>
        refreshToken().catch((error) => {
          // Don't capture token validation errors to Sentry as they're expected
          if (isTokenError(error)) {
            console.warn(
              'Token refresh failed due to token validation:',
              error.message
            )
          } else {
            captureException(error)
          }
        }),
      [refreshToken]
    ),
    600_000
  )

  // Get value to provide to the children.
  const value = useMemo<AuthContextType>(() => {
    // Access token is raw opaque token string.
    const accessToken = tokenResponse ? tokenResponse.accessToken : null

    // Try parsing ID token if present, otherwise use null.
    const idData = tokenResponse?.idToken
      ? parseIdToken(tokenResponse.idToken)
      : null

    // Is logged in if the access token is not null.
    const loggedIn = accessToken !== null

    // Compose value.
    return {
      tokenResponse,
      accessToken,
      idData,
      loggedIn,
      load,
      login,
      refreshToken,
      logout,
    }
  }, [load, login, logout, refreshToken, tokenResponse])

  if (!initialized) return null
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Uses the auth context.
 */
export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context)
    throw new Error('useAuthContext must be used within a AuthProvider')
  return context
}
