import AsyncStorage from '@react-native-async-storage/async-storage'
import NetInfo from '@react-native-community/netinfo'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'
import { QueryClient, onlineManager } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { ReactNode } from 'react'

// Connect online state.
onlineManager.setEventListener((setOnline) => {
  return NetInfo.addEventListener((state) => {
    setOnline(!!state.isConnected)
  })
})

/**
 * The query client instance. Can be used to externally trigger fetches or invalidate queries.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24 * 7,
    },
  },
})

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
})

/**
 * Provides the TanStack query client.
 * @param children The children to provide to.
 * @constructor
 */
export const QueryProvider = ({ children }: { children?: ReactNode | undefined }) => {
  return (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      {children}
    </PersistQueryClientProvider>
  )
}
