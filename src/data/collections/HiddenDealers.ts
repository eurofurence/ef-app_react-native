import {
  BasicIndex,
  createCollection,
  localStorageCollectionOptions,
} from '@tanstack/react-db'
import type { EfHiddenDealer } from '@/data/types/EfHiddenDealer'

export const hiddenDealersCollection = createCollection(
  localStorageCollectionOptions<EfHiddenDealer>({
    id: 'hidden-dealers',
    storageKey: 'hidden-dealers',
    getKey: (item) => item.Id,
    autoIndex: 'eager',
    defaultIndexType: BasicIndex,
  })
)

export function hiddenDealersToggle(key: EfHiddenDealer['Id']) {
  return hiddenDealersCollection.has(key)
    ? hiddenDealersCollection.delete(key)
    : hiddenDealersCollection.insert({ Id: key })
}
