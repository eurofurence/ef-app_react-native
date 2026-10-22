import { BasicIndex, createCollection } from '@tanstack/react-db'
import { queryClient } from '@/data/clients/query'
import { createAsyncStorageCollectionOptions } from '@/data/collections/createAsyncStorageCollectionOptions'
import type { EfLastViewTime } from '@/data/types/EfLastViewTime'

export const lastViewTimesCollection = createCollection(
  createAsyncStorageCollectionOptions<EfLastViewTime>({
    queryClient,
    id: 'last-view-times',
    storageKey: 'last-view-times',
    getKey: (item) => item.Id,
    autoIndex: 'eager',
    defaultIndexType: BasicIndex,
  })
)

export function lastViewTimesUpdate(key: EfLastViewTime['Id'], now: Date) {
  if (lastViewTimesCollection.has(key))
    lastViewTimesCollection.update(key, (draft) => {
      draft.Time = now
    })
  else lastViewTimesCollection.insert({ Id: key, Time: now })
}

export function lastViewTimesClear() {
  lastViewTimesCollection.delete([...lastViewTimesCollection.keys()])
}
