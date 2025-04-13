import { Schema, schema, schemaEntities, SchemaEntities, SchemaInternal, SchemaValues } from '@/context/data/CacheSchema'
import { cacheDebug } from '@/configuration'
import { useEffect } from 'react'
import * as Storage from '@/util/asyncStorage'
import { SchemaField } from '@/context/data/CacheTools'

/**
 * Projection of the schema definition to the store data.
 */
export type StoreData = Readonly<{
  [K in keyof Schema]: Schema[K]['defaultValue']
}>

/**
 * Update internals.
 */
export type StoreActionInternalsSet = {
  type: 'STORE_ACTION_INTERNALS_SET'
  value: Partial<Pick<StoreData, keyof SchemaInternal>>
}

/**
 * Action creator to update internals.
 * @param cid The convention identifier.
 * @param cacheVersion The cache version.
 * @param lastSynchronised The last synchronized timestamp as an ISO string.
 */
export function actionInternalsSet(cid: string, cacheVersion: number, lastSynchronised: string): StoreActionInternalsSet {
  return {
    type: 'STORE_ACTION_INTERNALS_SET',
    value: {
      cid,
      cacheVersion,
      lastSynchronised,
    },
  } as const
}

/**
 * Set a value.
 */
export type StoreActionValuesSet<T extends keyof SchemaValues> = {
  type: 'STORE_ACTION_VALUE_SET'
  key: T
  value: StoreData[T]
}

/**
 * Action creator to set a value.
 * @param key The key to set, one of the mutable values.
 * @param value The value to set to.
 */
export function actionValuesSet<T extends keyof SchemaValues>(key: T, value: StoreData[T]): StoreActionValuesSet<T> {
  return {
    type: 'STORE_ACTION_VALUE_SET',
    key,
    value,
  } as const
}

/**
 * Delete a value.
 */
export type StoreActionValuesDelete<T extends keyof SchemaValues> = {
  type: 'STORE_ACTION_VALUE_DELETE'
  key: T
}

/**
 * Action creator to delete a value.
 * @param key The key to delete, one of the mutable values.
 */
export function actionValuesDelete<T extends keyof SchemaValues>(key: T): StoreActionValuesDelete<T> {
  return {
    type: 'STORE_ACTION_VALUE_DELETE',
    key,
  } as const
}

/**
 * Update entities.
 */
export type StoreActionEntitiesChange<T extends keyof SchemaEntities> = {
  type: 'STORE_ACTION_ENTITIES_CHANGE'
  key: T
  removeAll?: boolean
  remove?: string[]
  add?: StoreData[T][number][]
}

/**
 * Action creator to apply an entity sync diff.
 * @param key The entity key, one of the entity sets.
 * @param removeAll True if all should be removed.
 * @param remove The keys to remove.
 * @param add The values to add.
 */
export function actionEntitiesChange<T extends keyof SchemaEntities>(key: T, removeAll?: boolean, remove?: string[], add?: StoreData[T][number][]): StoreActionEntitiesChange<T> {
  return {
    type: 'STORE_ACTION_ENTITIES_CHANGE',
    key,
    removeAll,
    remove,
    add,
  } as const
}

/**
 * Reset all data.
 */
export type StoreActionReset = {
  type: 'STORE_ACTION_RESET'
  data: StoreData
  cause?: string
}

/**
 * Action creator to set the entire store data.
 * @param data The data to set the store to.
 * @param cause The cause of the reset.
 */
export function actionReset(data: StoreData, cause?: string): StoreActionReset {
  return {
    type: 'STORE_ACTION_RESET',
    data,
    cause,
  } as const
}

/**
 * All store actions.
 */
export type StoreAction =
  | StoreActionInternalsSet
  | StoreActionValuesSet<keyof SchemaValues>
  | StoreActionValuesDelete<keyof SchemaValues>
  | StoreActionEntitiesChange<keyof SchemaEntities>
  | StoreActionReset

/**
 * Initial state mapped from schema bei the part's default values. Cast from
 * object because `entries`/`fromEntries` will not retain type info.
 */
export const initialState: StoreData = Object.fromEntries(Object.entries(schema).map(([key, value]) => [key, value.defaultValue])) as StoreData

/**
 * Reducer for store state and cache related actions.
 * @param state Current state.
 * @param action Action to apply.
 */
export const storeReducer = (state: StoreData, action: StoreAction): StoreData => {
  if (cacheDebug) {
    console.log(action.type, state, action)
  }
  switch (action.type) {
    case 'STORE_ACTION_INTERNALS_SET': {
      return { ...state, ...action.value }
    }
    case 'STORE_ACTION_VALUE_SET': {
      return { ...state, [action.key]: action.value }
    }
    case 'STORE_ACTION_VALUE_DELETE': {
      const copy = { ...state }
      delete copy[action.key]
      return copy
    }
    case 'STORE_ACTION_ENTITIES_CHANGE': {
      if (!action.removeAll && !action.remove?.length && !action.add?.length) return state

      const currentOrDefault = state[action.key]

      if (!currentOrDefault || action.removeAll) {
        // No state yet or existing state will be removed. Create new from items.
        const sorter = schemaEntities[action.key].compare
        const values = []
        if (action.add) {
          values.push(...action.add)
          values.sort(sorter as (left: unknown, right: unknown) => number)
        }

        // Derive secondaries.
        const dict: Record<string, (typeof values)[number]> = {}
        for (const item of values) dict[item.Id] = item

        return { ...state, [action.key]: Object.assign(values, { dict }) }
      } else {
        // State exists and is not completely removed. Update with new data and remove filtered records.

        // Keys that will be deleted from the current values in the
        // store. Either explicitly or from an entity change.
        const deleteKeys = new Set()
        if (action.remove) for (const id of action.remove) deleteKeys.add(id)
        if (action.add) for (const item of action.add) deleteKeys.add(item.Id)

        // Remove the "removed" values and those that will be added again as changed entities.
        const sorter = schemaEntities[action.key].compare
        const values = currentOrDefault.filter((item) => !deleteKeys.has(item.Id))
        if (action.add) {
          values.push(...action.add)
          values.sort(sorter as (left: unknown, right: unknown) => number)
        }

        // Derive secondaries.
        const dict: Record<string, (typeof values)[number]> = {}
        for (const item of values) dict[item.Id] = item

        return { ...state, [action.key]: Object.assign(values, { dict }) }
      }
    }
    case 'STORE_ACTION_RESET': {
      return action.data
    }

    default:
      return state
  }
}

/**
 * Connects a data store persistor. Resolves the cache data of the given store
 * and persists it under the store name as key.
 * @param data The cache data.
 * @param store The store name.
 * @param debounce Delay before serializing. If data is updated within the given interval, only the last value is saved.
 */
export function usePersistor<T extends keyof Schema>(data: StoreData, store: T, debounce = 100) {
  const location = data[store]
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      Storage.set(store, (schema[store] as SchemaField<unknown>).serialize(location)).catch()
    }, debounce)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [location, store, debounce])
}
