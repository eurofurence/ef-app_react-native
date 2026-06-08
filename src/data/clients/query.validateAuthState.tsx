import { auth } from '@/data/clients/auth'
import { queryClient } from '@/data/clients/query'

let lastKey: string | undefined

export function validateAuthState() {
  if (!auth.isReady) return
  const authKey = `${auth.state.idData?.sub ?? ''}/${auth.state.user?.Roles?.join(',') ?? ''}`

  if (authKey === lastKey) return
  lastKey = authKey

  // Invalidate all authorized queries.
  queryClient
    .invalidateQueries({
      predicate(query) {
        // Opt-in queries that do not send token.
        return query.meta?.anon !== true
      },
    })
    .catch(console.error)
}
