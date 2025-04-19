import { CommunicationDetails } from '@/context/data/types.details'
import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react'
import { useAsyncInterval } from '@/hooks/util/useAsyncInterval'
import { getAccessToken, useAuthContext } from '@/context/auth/Auth'
import { apiBase } from '@/configuration'
import { useAsyncCallbackOnce } from '@/hooks/util/useAsyncCallbackOnce'
import { captureException } from '@sentry/react-native'

/**
 * Authenticated data refresh interval.
 */
const refreshInterval = 300_000

/**
 * Authenticated data context. This contains implicitly retrieved user values.
 */
export type AuthDataContextType = {
  /**
   * True if currently refreshing.
   */
  isRefreshing: boolean

  /**
   * Updates the authenticated data.
   */
  refresh(): Promise<void>

  /**
   * User private messages.
   */
  communications: readonly CommunicationDetails[] | null
}

/**
 * Context object.
 */
const AuthDataContext = createContext<AuthDataContextType | undefined>(undefined)
AuthDataContext.displayName = 'AuthDataContext'

/**
 * Provides authenticated data.
 * @param children The children this context is provided to.
 * @constructor
 */
export const AuthDataProvider = ({ children }: { children?: ReactNode | undefined }) => {
  const { loggedIn, claims } = useAuthContext()
  const [communications, setCommunications] = useState<readonly CommunicationDetails[] | null>(null)
  const [isRefreshing, setRefreshing] = useState<boolean>(false)

  // Reload method.
  const refresh = useAsyncCallbackOnce(
    useCallback(async () => {
      try {
        setRefreshing(true)

        // Started without logged-in state. Reset.
        if (!loggedIn || !claims?.sub) {
          setCommunications([])
          return
        }

        // Try to get the access token, it might be null at that point. If it's
        // not present, reset data and return.
        const accessToken = await getAccessToken()
        if (!accessToken) {
          setCommunications([])
          return
        }

        // Get from API.
        const response = await fetch(`${apiBase}/Communication/PrivateMessages`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          redirect: 'manual',
        })

        // Check if response is OK
        if (!response.ok) {
          setCommunications([])
          return
        }

        // Check that response is JSON.
        if (!response.headers.get('Content-type')?.includes('application/json')) {
          setCommunications([])
          return
        }

        // Get data, set to communication.
        const data = await response.json()
        setCommunications(data)
      } finally {
        setRefreshing(false)
      }
    }, [loggedIn, claims?.sub])
  )

  // Refresh connection.
  useAsyncInterval(
    useCallback(
      async (_) => {
        // Try refresh and capture any exception that happens in the background.
        try {
          await refresh()
        } catch (error) {
          captureException(error)
        }
      },
      [refresh]
    ),
    refreshInterval
  )

  const value = useMemo(() => ({ communications, isRefreshing, refresh }), [communications, isRefreshing, refresh])
  return <AuthDataContext.Provider value={value}>{children}</AuthDataContext.Provider>
}

/**
 * Uses the raw cache data. Consider using `useCache` instead.
 */
export const useAuthData = () => {
  const context = useContext(AuthDataContext)
  if (!context) throw new Error('useAuthData must be used within a AuthDataProvider')
  return context
}
