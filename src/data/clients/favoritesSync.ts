import { captureException } from '@sentry/react-native'

import { api } from '@/data/clients/api'
import { favoriteEventsCollection } from '@/data/collections/FavoriteEvents'

/**
 * Pure union diff between local and remote favourite ids. `pushed` are local
 * ids missing from the backend; `pulled` are remote ids missing locally.
 */
export function computeFavoriteSync(
  localIds: readonly string[],
  remoteIds: readonly string[]
): { pushed: string[]; pulled: string[] } {
  const localSet = new Set(localIds)
  const remoteSet = new Set(remoteIds)
  return {
    pushed: localIds.filter((id) => !remoteSet.has(id)),
    pulled: remoteIds.filter((id) => !localSet.has(id)),
  }
}

export async function fetchRemoteFavoriteEventIds(): Promise<string[]> {
  const res = await api.get('/Events/Favorites')
  return ((res.data as { Id: string }[] | null) ?? []).map((e) => e.Id)
}

export async function pushFavoriteEvent(id: string): Promise<void> {
  await api.post(`/Events/${id}/:favorite`)
}

export async function removeFavoriteEvent(id: string): Promise<void> {
  await api.delete(`/Events/${id}/:favorite`)
}

/**
 * Union-merges local and remote favourites: pushes offline-added favourites to
 * the backend and inserts remote-only favourites into the local collection.
 * Never deletes from either side. Throws if the remote fetch fails (caller
 * aborts); individual push failures are swallowed.
 */
export async function mergeFavoriteEvents(): Promise<{
  pulled: string[]
  pushed: string[]
}> {
  const remoteIds = await fetchRemoteFavoriteEventIds()
  const localIds = (await favoriteEventsCollection.toArrayWhenReady()).map(
    (item) => item.Id
  )
  const { pushed, pulled } = computeFavoriteSync(localIds, remoteIds)
  await Promise.all(
    pushed.map((id) => pushFavoriteEvent(id).catch(captureException))
  )
  for (const id of pulled) {
    if (!favoriteEventsCollection.has(id)) {
      favoriteEventsCollection.insert({ Id: id })
    }
  }
  return { pulled, pushed }
}

/** Deletes every favourite from the local collection. Local only. */
export function clearLocalFavoriteEvents(): void {
  for (const id of Array.from(favoriteEventsCollection.keys())) {
    favoriteEventsCollection.delete(id)
  }
}
