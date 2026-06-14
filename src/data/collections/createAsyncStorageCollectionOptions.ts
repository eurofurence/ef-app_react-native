import type { QueryFunctionContext } from '@tanstack/query-core'
import {
  type QueryCollectionConfig,
  queryCollectionOptions,
} from '@tanstack/query-db-collection'
import * as AsyncStorage from '@/util/asyncStorage'
import { parseJsonSafe, stringifyJsonSafe } from '@/util/json'

export function createAsyncStorageCollectionOptions<
  T extends object,
  TError = unknown,
  TKey extends string | number = string | number,
>(
  config: Omit<
    QueryCollectionConfig<
      T,
      (context: QueryFunctionContext<any>) => Array<T> | Promise<Array<T>>,
      TError,
      ['_storage_collection', string],
      TKey
    >,
    'queryKey' | 'onDelete' | 'onUpdate' | 'onInsert' | 'queryFn'
  > & {
    storageKey: string
    schema?: never // prohibit schema
  }
) {
  return queryCollectionOptions({
    ...config,
    queryKey: ['_storage_collection', config.storageKey],
    async queryFn() {
      const keys = await AsyncStorage.getAllKeys()
      const owned = keys.filter((key) =>
        key.startsWith(`${config.storageKey}/`)
      )
      const resolved = await Promise.all(owned.map(AsyncStorage.get))
      return resolved.map((value) =>
        value === null ? null : parseJsonSafe(value)
      )
    },
    meta: {
      anon: true,
    },
    onDelete: async ({ transaction }) => {
      for (const mutation of transaction.mutations) {
        await AsyncStorage.remove(`${config.storageKey}/${mutation.key}`)
      }
    },
    onUpdate: async ({ transaction }) => {
      for (const mutation of transaction.mutations) {
        await AsyncStorage.set(
          `${config.storageKey}/${mutation.key}`,
          stringifyJsonSafe(mutation.modified)
        )
      }
    },
    onInsert: async ({ transaction }) => {
      for (const mutation of transaction.mutations) {
        await AsyncStorage.set(
          `${config.storageKey}/${mutation.key}`,
          stringifyJsonSafe(mutation.modified)
        )
      }
    },
  })
}
