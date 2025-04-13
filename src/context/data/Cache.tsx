import React, { createContext, ReactNode, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react'
import { Vibration } from 'react-native'
import { apiBase, conId, eurofurenceCacheVersion } from '@/configuration'
import * as Storage from '@/util/asyncStorage'

import { CacheExtensions, useCacheExtensions } from '@/context/data/useCacheExtensions'
import { schema, Schema, SchemaEntities, schemaEntities, SchemaValues } from '@/context/data/CacheSchema'
import { SchemaField } from '@/context/data/CacheTools'
import {
  actionEntitiesChange,
  actionInternalsSet,
  actionReset,
  actionValuesDelete,
  actionValuesSet,
  initialState,
  StoreData,
  storeReducer,
  usePersistor,
} from '@/context/data/CacheStore'

/**
 * Cache context.
 */
export type CacheContextType = {
  /**
   * Raw store data, including un-extended entity records.
   */
  data: StoreData

  /**
   * Gets a "value type" store value.
   * @param store The name of the store.
   */
  // todo: Implicit change semantics is not really optimal. do we need to have the data in there like we have extensions?
  getValue<T extends keyof SchemaValues>(store: T): StoreData[T]

  /**
   * Sets a "value type" store value.
   * @param store The name of the store.
   * @param to The value to assign to.
   */
  setValue<T extends keyof SchemaValues>(store: T, to: StoreData[T]): void

  /**
   * Removes a "value type" store value.
   * @param store The name of the store.
   */
  removeValue<T extends keyof SchemaValues>(store: T): void

  /**
   * If true, data is synchronizing right now.
   */
  isSynchronizing: boolean

  /**
   * Synchronize now.
   */
  synchronize(): Promise<void>

  /**
   * Synchronize now with UI integration.
   * @param vibrate True if device should vibrate.
   */
  synchronizeUi(vibrate?: boolean): Promise<void>

  /**
   * Resets the data.
   */
  clear(): void
} & CacheExtensions

/**
 * Context object.
 */
const CacheContext = createContext<CacheContextType | undefined>(undefined)
CacheContext.displayName = 'CacheContext'

/**
 * Provides raw cache integration.
 * @param children The children this context is provided to. May not be rendered
 * if the state is not available yet.
 * @constructor
 */
export const CacheProvider = ({ children }: { children?: ReactNode | undefined }) => {
  // Internal state. Initialized is tracked to stop rendering if data is not
  // hydrated yet. Cache data is the full cache state.
  const [initialized, setInitialized] = useState(false)
  const [data, dispatch] = useReducer(storeReducer, initialState)

  // Data cache ref is used to provide soft access to values for callbacks
  // that should not update their value along with the cache data.
  const dataRef = useRef(data)
  dataRef.current = data

  // Initial hydration effect.
  useEffect(() => {
    let go = true

    // Get all source fields.
    Storage.multiGet(Object.keys(schema))
      .then((stored) => {
        if (!go) return

        // Hydrate all and dispatch ready state. Skip unknown.
        const data: Record<string, any> = { ...initialState }
        for (const [key, value] of stored) {
          if (key in schema && value !== null) {
            data[key] = schema[key as keyof Schema].deserialize(value)
          }
        }

        // Dispatch init.
        dispatch(actionReset(data as StoreData, 'init'))
      })
      .catch(() => {
        if (!go) return

        // Safety fallback clean store.
        Storage.multiSet(
          Object.entries(schema).map(([key, field]) => {
            // Cast to unknown field. We know that the definition should match as it comes from the
            // schema itself.
            return [key, (field as SchemaField<unknown>).serialize(field.defaultValue)]
          })
        ).catch()

        // Dispatch reset.
        dispatch(actionReset(initialState, 'init error'))
      })
      .finally(() => {
        setInitialized(true)
      })

    return () => {
      go = false
    }
  }, [])

  // All dehydrators for the state.
  for (const key in schema) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    usePersistor(data, key as keyof Schema)
  }

  // Direct cache access methods.
  const getValue = useCallback(
    <T extends keyof SchemaValues>(store: T): StoreData[T] => {
      return data[store]
    },
    [data]
  )
  const setValue = useCallback(<T extends keyof SchemaValues>(store: T, to: StoreData[T]): void => {
    dispatch(actionValuesSet(store, to))
  }, [])

  const removeValue = useCallback(<T extends keyof SchemaValues>(store: T): void => {
    dispatch(actionValuesDelete(store))
  }, [])

  // Clear dispatcher.
  const clear = useCallback(async () => {
    Vibration.vibrate(400)
    dispatch(actionReset(initialState, 'cleared explicitly'))
  }, [])

  // Secondary state. Synchronizing is set from the callback according to
  // its runtime and completion. Invocation tracks an abort controller to
  // stop a running invocation if needed.
  const [isSynchronizing, setIsSynchronizing] = useState(false)
  const invocation = useRef<AbortController | null>(null)

  // Synchronization function.
  const synchronize = useCallback(async () => {
    const ownInvocation = new AbortController()
    invocation.current?.abort()
    invocation.current = ownInvocation
    setIsSynchronizing(true)

    const { lastSynchronised, cid, cacheVersion } = dataRef.current

    // Sync fully if state is for a different convention.
    const path = lastSynchronised && cid === conId && cacheVersion === eurofurenceCacheVersion ? `Sync?since=${lastSynchronised}` : `Sync`

    try {
      const response = await fetch(`${apiBase}/${path}`, { signal: ownInvocation.signal })
      if (!response.ok) {
        throw new Error('API response not OK')
      }
      if (!response.headers.get('Content-type')?.includes('application/json')) {
        throw new Error('API response is not JSON')
      }
      const data = await response.json()

      // Convention identifier switched, transfer new one and clear all data irrespective of the clear data flag.
      if (data.ConventionIdentifier !== conId || cacheVersion !== eurofurenceCacheVersion) {
        dispatch(actionReset(initialState, 'CID or format change'))
        dispatch(actionInternalsSet(conId, eurofurenceCacheVersion, lastSynchronised))
      }

      // Dispatch all received changes to the reducer.
      for (const key in schemaEntities) {
        const store = key as keyof SchemaEntities
        const change = data[schemaEntities[store].syncResponseField]
        dispatch(actionEntitiesChange(store, change.RemoveAllBeforeInsert, change.DeletedEntities, change.ChangedEntities))
      }

      dispatch(actionInternalsSet(conId, eurofurenceCacheVersion, data.CurrentDateTimeUtc))
    } finally {
      if (invocation.current === ownInvocation) {
        setIsSynchronizing(false)
      }
    }
  }, [])

  // UI synchronize wrapper.
  const synchronizeUi = useCallback(
    async (vibrate: boolean = false) => {
      if (vibrate) Vibration.vibrate(400)
      try {
        return await synchronize()
      } catch (error) {
        console.warn('Synchronization error:', error)
        throw error
      }
    },
    [synchronize]
  )

  // Run synchronize initially.
  useEffect(() => {
    if (initialized) synchronize().catch(console.error)
  }, [initialized, synchronize])

  // Use extensions.
  const extensions = useCacheExtensions(data)

  // TODO: All the data usually changes together, I've removed the memo as that's
  //   just dependency tracking overhead.
  return (
    <CacheContext.Provider
      value={{
        data,
        getValue,
        setValue,
        removeValue,
        clear,
        isSynchronizing,
        synchronize,
        synchronizeUi,
        ...extensions,
      }}
    >
      {initialized ? children : null}
    </CacheContext.Provider>
  )
}

/**
 * Uses the raw cache data. Consider using `useCache` instead.
 */
export const useCache = () => {
  const context = useContext(CacheContext)
  if (!context) throw new Error('useCache must be used within a CacheProvider')
  return context
}
