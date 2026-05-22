import { QueryClient } from '@tanstack/query-core'
import { useAuthStore } from '@/data/clients/auth'

export const queryClient = new QueryClient()

useAuthStore.subscribe((state, previousState) => {
  // Same subject, ignore this case.
  if (state.idData?.sub === previousState.idData?.sub) return

  // Invalidate all authorized queries.
  queryClient.invalidateQueries({
    predicate(query) {
      // Opt-in queries that do not send token.
      return query.meta?.anon !== true
    },
  }).catch(console.error)
})
