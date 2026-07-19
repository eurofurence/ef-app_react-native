import { BasicIndex, createCollection } from '@tanstack/react-db'
import { queryClient } from '@/data/clients/query'
import { createAsyncStorageCollectionOptions } from '@/data/collections/createAsyncStorageCollectionOptions'
import type { EfFavoriteDealer } from '@/data/types/EfFavoriteDealer'

export const favoriteDealersCollection = createCollection(
  createAsyncStorageCollectionOptions<EfFavoriteDealer>({
    queryClient,
    id: 'favorite-dealers',
    storageKey: 'favorite-dealers',
    getKey: (item) => item.Id,
    autoIndex: 'eager',
    defaultIndexType: BasicIndex,
  })
)

export function favoriteDealersToggle(key: EfFavoriteDealer['Id']) {
  return favoriteDealersCollection.has(key)
    ? favoriteDealersCollection.delete(key)
    : favoriteDealersCollection.insert({ Id: key })
}
