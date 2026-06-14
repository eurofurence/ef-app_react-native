import AsyncStorage from '@react-native-async-storage/async-storage'
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister'

/**
 * Async storage persister for queries.
 */
export const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
})
