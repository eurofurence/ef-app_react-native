import { BasicIndex, createCollection } from '@tanstack/react-db'
import { queryClient } from '@/data/clients/query'
import { createAsyncStorageCollectionOptions } from '@/data/collections/createAsyncStorageCollectionOptions'
import type { EfHiddenDealer } from '@/data/types/EfHiddenDealer'

export const hiddenDealersCollection = createCollection(
  createAsyncStorageCollectionOptions<EfHiddenDealer>({
    queryClient,
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
