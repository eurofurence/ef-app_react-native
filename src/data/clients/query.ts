import { QueryClient } from '@tanstack/query-core'
import { auth } from '@/data/clients/auth'

export const queryClient = new QueryClient()

let lastSub: string | undefined

auth.subscribe(() => {
  if (auth.idData?.sub === lastSub) return
  lastSub = auth.idData?.sub

  // Invalidate all authorized queries.
  queryClient
    .invalidateQueries({
      predicate(query) {
        // Opt-in queries that do not send token.
        return query.meta?.anon !== true
      },
    })
    .catch(console.error)
})
