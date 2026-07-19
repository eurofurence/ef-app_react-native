import { BasicIndex, createCollection } from '@tanstack/react-db'
import { queryClient } from '@/data/clients/query'
import { createAsyncStorageCollectionOptions } from '@/data/collections/createAsyncStorageCollectionOptions'
import type { EfHiddenEvent } from '@/data/types/EfHiddenEvent'

export const hiddenEventsCollection = createCollection(
  createAsyncStorageCollectionOptions<EfHiddenEvent>({
    queryClient,
    id: 'hidden-events',
    storageKey: 'hidden-events',
    getKey: (item) => item.Id,
    autoIndex: 'eager',
    defaultIndexType: BasicIndex,
  })
)

export function hiddenEventsToggle(key: EfHiddenEvent['Id']) {
  return hiddenEventsCollection.has(key)
    ? hiddenEventsCollection.delete(key)
    : hiddenEventsCollection.insert({ Id: key })
}

export function hiddenEventsClear() {
  hiddenEventsCollection.delete([...hiddenEventsCollection.keys()])
}
