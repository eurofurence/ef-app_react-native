import { BasicIndex, createCollection } from '@tanstack/react-db'
import { queryClient } from '@/data/clients/query'
import { createAsyncStorageCollectionOptions } from '@/data/collections/createAsyncStorageCollectionOptions'
import type { EfLocalNotification } from '@/data/types/EfLocalNotification'

export const localNotificationsCollection = createCollection(
  createAsyncStorageCollectionOptions<EfLocalNotification>({
    queryClient,
    id: 'local-notifications',
    storageKey: 'local-notifications',
    getKey: (item) => item.Id,
    autoIndex: 'eager',
    defaultIndexType: BasicIndex,
  })
)

export function useLocalNotificationsIntegration() {
  // todo
}
