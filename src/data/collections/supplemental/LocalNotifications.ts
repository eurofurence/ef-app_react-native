import {queryClient} from '@/data/clients/query'
import {createAsyncStorageCollectionOptions} from '@/data/collections/createAsyncStorageCollectionOptions'
import type {EfLocalNotification} from '@/data/types/EfLocalNotification'
import {BasicIndex, createCollection} from '@tanstack/react-db'

export const localNotificationsCollection = createCollection(
  createAsyncStorageCollectionOptions<EfLocalNotification>({
    queryClient,
    id: 'local-notifications',
    storageKey: 'local-notifications',
    getKey: (item) => item.TargetId,
    autoIndex: 'eager',
    defaultIndexType: BasicIndex,
  })
)


