import { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

/**
 * The query client instance. Can be used to externally trigger fetches or invalidate queries.
 */
export const queryClient = new QueryClient()

/**
 * Provides the TanStack query client.
 * @param children The children to provide to.
 * @constructor
 */
export const QueryProvider = ({ children }: { children?: ReactNode | undefined }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
