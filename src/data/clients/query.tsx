import { QueryClient } from '@tanstack/react-query'

/**
 * Global query client.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24 * 7,
    },
  },
})
