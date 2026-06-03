import {
  BasicIndex,
  createCollection,
  localStorageCollectionOptions,
} from '@tanstack/react-db'
import type { EfFavoriteDealer } from '@/data/types/EfFavoriteDealer'

export const favoriteDealersCollection = createCollection(
  localStorageCollectionOptions<EfFavoriteDealer>({
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
