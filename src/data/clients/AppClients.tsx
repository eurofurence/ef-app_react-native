import NetInfo from '@react-native-community/netinfo'
import { onlineManager } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { type ReactNode, useEffect } from 'react'
import { auth } from '@/data/clients/auth'
import { queryClient } from '@/data/clients/query'
import { persister } from '@/data/clients/query.persister'
import { validateAuthState } from '@/data/clients/query.validateAuthState'

/**
 * Provides the TanStack query client.
 * @param children The children to provide to.
 * @constructor
 */
export const AppClients = ({
  children,
}: {
  children?: ReactNode | undefined
}) => {
  // Online manager and auth client integration.
  useEffect(() => {
    const unsubscribeNet = NetInfo.addEventListener((state) =>
      onlineManager.setOnline(Boolean(state.isConnected))
    )
    const unsubscribeAuth = auth.subscribe(() => validateAuthState())
    auth.start()
    return () => {
      auth.stop()
      unsubscribeAuth()
      unsubscribeNet()
    }
  }, [])

  // Return persisted query provider. Validate on persistence completed.
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{ persister }}
      onSuccess={validateAuthState}
      onError={validateAuthState}
    >
      {children}
    </PersistQueryClientProvider>
  )
}
