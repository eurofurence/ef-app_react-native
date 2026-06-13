import { BasicIndex, createCollection } from '@tanstack/react-db'
import { queryClient } from '@/data/clients/query'
import { createAsyncStorageCollectionOptions } from '@/data/collections/createAsyncStorageCollectionOptions'
import type { EfFavoriteEvent } from '@/data/types/EfFavoriteEvent'

export const favoriteEventsCollection = createCollection(
  createAsyncStorageCollectionOptions<EfFavoriteEvent>({
    queryClient,
    id: 'favorite-events',
    storageKey: 'favorite-events',
    getKey: (item) => item.Id,
    autoIndex: 'eager',
    defaultIndexType: BasicIndex,
  })
)

export function favoriteEventsToggle(key: EfFavoriteEvent['Id']) {
  return favoriteEventsCollection.has(key)
    ? favoriteEventsCollection.delete(key)
    : favoriteEventsCollection.insert({ Id: key })
}
