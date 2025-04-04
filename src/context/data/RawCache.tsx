import React, { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { Vibration } from 'react-native'
import { apiBase, cacheDebug, conId, eurofurenceCacheVersion, syncDebug } from '@/configuration'
import { Notification } from '@/store/background/slice'
import * as Storage from '@/context/data/RawCache.Storage'
import { defaultSorters } from '@/context/data/RawCache.Sorters'
import { emptyArray, emptyDict, stringifyJsonSafe } from '@/context/data/RawCache.Utils'
import { itemDehydrators } from '@/context/data/RawCache.Dehydrators'
import { itemHydrators } from '@/context/data/RawCache.Hydrators'
import {
    AnnouncementRecord,
    CommunicationRecord, DealerRecord, EventDayRecord, EventRecord, EventRoomRecord, EventTrackRecord,
    ImageRecord,
    KnowledgeEntryRecord,
    KnowledgeGroupRecord, MapRecord,
    Settings,
} from '@/context/data/types'

/**
 * Entity store, contains a list of keys, list of sorted values, and associative
 * object from ID to value.
 */
export type EntityStore<T> = {
    keys: string[];
    values: T[];
    dict: Record<string, T>;
}

/**
 * Internal values stored in the cache. Used for operation of the sync mechanism.
 */
export type StoreInternals = {
    /**
     * Convention ID for the data in the store.
     */
    cid: string;

    /**
     * Cache data version. If changed, format is different and needs to be
     * reloaded.
     */
    cacheVersion: number;

    /**
     * Last synchronized time.
     */
    lastSynchronised: string;
}

/**
 * Direct value stores in the cache. These values are persisted and loaded
 * as-is.
 */
export type StoreValues = {
    /**
     * User settings.
     */
    settings: Settings;

    /**
     * Currently registered notifications (i.e., event reminders).
     */
    notifications: Notification[];
}

/**
 * Resolved raw entity data.
 */
export type StoreEntities = {
    announcements: EntityStore<AnnouncementRecord>;
    dealers: EntityStore<DealerRecord>;
    images: EntityStore<ImageRecord>;
    events: EntityStore<EventRecord>;
    eventDays: EntityStore<EventDayRecord>;
    eventRooms: EntityStore<EventRoomRecord>;
    eventTracks: EntityStore<EventTrackRecord>;
    knowledgeGroups: EntityStore<KnowledgeGroupRecord>;
    knowledgeEntries: EntityStore<KnowledgeEntryRecord>;
    maps: EntityStore<MapRecord>;
    communications: EntityStore<CommunicationRecord>;
}

/**
 * Data stored in the cache.
 */
export type StoreData = StoreInternals & StoreValues & StoreEntities;

/**
 * Instance of the key array.
 */
export const StoreKeys = ['cid', 'cacheVersion', 'lastSynchronised', 'settings',
    'notifications', 'announcements', 'dealers', 'images', 'events', 'eventDays',
    'eventRooms', 'eventTracks', 'knowledgeGroups', 'knowledgeEntries', 'maps', 'communications'] as const

/**
 * Helper to resolve the type of the entity by store name.
 */
export type StoreEntityType<T extends keyof StoreEntities> = StoreEntities[T]['values'][number]

/**
 * Update internals.
 */
type StoreActionInternalsSet = {
    type: 'STORE_ACTION_INTERNALS_SET',
    value: Partial<StoreInternals>;
};

/**
 * Set a value.
 */
type StoreActionValuesSet<T extends keyof StoreValues> = {
    type: 'STORE_ACTION_VALUE_SET',
    key: T,
    value: StoreValues[T];
};

/**
 * Delete a value.
 */
type StoreActionValuesDelete<T extends keyof StoreValues> = {
    type: 'STORE_ACTION_VALUE_DELETE',
    key: T,
};

/**
 * Update entities.
 */
type StoreActionEntitiesChange<T extends keyof StoreEntities> = {
    type: 'STORE_ACTION_ENTITIES_CHANGE',
    key: T,
    removeAll?: boolean,
    remove?: string[],
    add?: StoreEntityType<T>[]
}

/**
 * Reset all data.
 */
type StoreActionReset = {
    type: 'STORE_ACTION_RESET'
    data: Partial<StoreData>,
    cause?: string;
}

/**
 * All store actions.
 */
type StoreAction = StoreActionInternalsSet
    | StoreActionValuesSet<keyof StoreValues>
    | StoreActionValuesDelete<keyof StoreValues>
    | StoreActionEntitiesChange<keyof StoreEntities>
    | StoreActionReset;

/**
 * Reducer for store state and cache related actions.
 * @param state Current state.
 * @param action Action to apply.
 */
const storeReducer = (state: Partial<StoreData>, action: StoreAction): Partial<StoreData> => {
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
                const sorter = defaultSorters[action.key]
                const values = []
                if (action.add) {
                    values.push(...action.add)
                    values.sort(sorter as any)
                }

                // Derive secondaries.
                const keys = values.map(item => item.Id)
                const dict: Record<string, (typeof values)[number]> = {}
                for (const item of values)
                    dict[item.Id] = item

                return { ...state, [action.key]: { keys, values, dict } }
            } else {
                // State exists and is not completely removed. Update with new data and remove filtered records.

                // Keys that will be deleted from the current values in the
                // store. Either explicitly or from an entity change.
                const deleteKeys = new Set()
                if (action.remove)
                    for (const id of action.remove)
                        deleteKeys.add(id)
                if (action.add)
                    for (const item of action.add)
                        deleteKeys.add(item.Id)

                // Remove the "removed" values and those that will be added again as changed entities.
                const sorter = defaultSorters[action.key]
                const values = currentOrDefault.values.filter(item => !deleteKeys.has(item.Id))
                if (action.add)
                    values.push(...action.add)
                values.sort(sorter as any)

                // Derive secondaries.
                const keys = values.map(item => item.Id)
                const dict: Record<string, (typeof values)[number]> = {}
                for (const item of values)
                    dict[item.Id] = item

                return { ...state, [action.key]: { keys, values, dict } }
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
function usePersistor<T extends keyof StoreData>(data: Partial<StoreData>, store: T, debounce = 100) {
    const location = data[store]
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const value = location
            if (value)
                Storage.set(store, itemDehydrators[store](value))
            else
                Storage.set(store, stringifyJsonSafe(undefined))
        }, debounce)
        return () => {
            clearTimeout(timeoutId)
        }
    }, [location, store, debounce])
}


/**
 * Raw cache data context.
 */
export interface RawCacheContextType {
    /**
     * The full cache data. Should not be manipulated directly, but can be used
     * for educated reads.
     */
    cacheData: Partial<StoreData>;

    /**
     * Gets a "value type" store value.
     * @param store The name of the store.
     */
    getValue<T extends keyof StoreValues>(store: T): StoreValues[T] | undefined;

    /**
     * Sets a "value type" store value.
     * @param store The name of the store.
     * @param to The value to assign to.
     */
    setValue<T extends keyof StoreValues>(store: T, to: StoreValues[T]): void;

    /**
     * Removes a "value type" store value.
     * @param store The name of the store.
     */
    removeValue<T extends keyof StoreValues>(store: T): void;

    /**
     * Gets all keys for a given entity by its store name.
     * @param store The name of the store.
     */
    getEntityKeys<T extends keyof StoreEntities>(store: T): StoreEntities[T]['keys'];

    /**
     * Gets all values for a given entity by its store name.
     * @param store The name of the store.
     */
    getEntityValues<T extends keyof StoreEntities>(store: T): StoreEntities[T]['values'];

    /**
     * Gets the associative object for a given entity by its store name.
     * @param store The name of the store.
     */
    getEntityDict<T extends keyof StoreEntities>(store: T): StoreEntities[T]['dict'];

    /**
     * Gets an entity by its store name and key.
     * @param store The name of the store.
     * @param key The ID of the entity.
     */
    getEntity<T extends keyof StoreEntities>(store: T, key: string): StoreEntities[T]['dict'][string] | undefined;

    /**
     * If true, data is synchronizing right now.
     */
    isSynchronizing: boolean;

    /**
     * Synchronize now.
     */
    synchronize(): Promise<void>;

    /**
     * Synchronize now with UI integration.
     * @param vibrate True if device should vibrate.
     */
    synchronizeUi(vibrate?: boolean): Promise<void>;

    /**
     * Resets the data.
     */
    clear(): void;
}

/**
 * Context object.
 */
const RawCacheContext = createContext<RawCacheContextType | undefined>(undefined)
RawCacheContext.displayName = 'RawCacheContext'

export type RawCacheProps = {
    postSync?: (data: Partial<StoreData>) => Promise<Partial<StoreData>>;
    children?: ReactNode | undefined;
}

/**
 * Provides raw cache integration.
 * @param postSync Callback to invoke after sync. Can perform state reaction that needs
 * to happen before synchronization is marked completed.
 * @param children The children this context is provided to. May not be rendered
 * if the state is not available yet.
 * @constructor
 */
export const RawCacheProvider = ({ postSync, children }: RawCacheProps) => {
    // Internal state. Initialized is tracked to stop rendering if data is not
    // hydrated yet. Cache data is the full cache state.
    const [initialized, setInitialized] = useState(false)
    const [cacheData, dispatch] = useReducer(storeReducer, {})

    // Data cache ref is used to provide soft access to values for callbacks
    // that should not update their value along with the cache data.
    const cacheDataRef = useRef(cacheData)
    cacheDataRef.current = cacheData

    // Initial hydration effect.
    useEffect(() => {
        let go = true
        Storage.multiGet(StoreKeys).then(stored => {
            if (!go) return
            // Hydrate all and dispatch ready state.
            const data: Record<string, any> = {}
            for (const [key, value] of stored) {
                if (value === null) continue
                data[key] = itemHydrators[key as keyof StoreData](value)
            }
            dispatch({
                type: 'STORE_ACTION_RESET', data: data, cause: 'init',
            })
        }).catch(() => {
            if (!go) return

            // Safety fallback clean store.
            Storage.multiSet([
                ['cid', stringifyJsonSafe(undefined)],
                ['cacheVersion', stringifyJsonSafe(undefined)],
                ['lastSynchronised', stringifyJsonSafe(undefined)],
                ['settings', stringifyJsonSafe(undefined)],
                ['notifications', stringifyJsonSafe(undefined)],
                ['announcements', stringifyJsonSafe(undefined)],
                ['dealers', stringifyJsonSafe(undefined)],
                ['images', stringifyJsonSafe(undefined)],
                ['events', stringifyJsonSafe(undefined)],
                ['eventDays', stringifyJsonSafe(undefined)],
                ['eventRooms', stringifyJsonSafe(undefined)],
                ['eventTracks', stringifyJsonSafe(undefined)],
                ['knowledgeGroups', stringifyJsonSafe(undefined)],
                ['knowledgeEntries', stringifyJsonSafe(undefined)],
                ['maps', stringifyJsonSafe(undefined)],
                ['communications', stringifyJsonSafe(undefined)],
            ]).catch()
            dispatch({
                type: 'STORE_ACTION_RESET', data: {}, cause: 'init error',
            })
        }).finally(() => {
            setInitialized(true)
        })

        return () => {
            go = false
        }
    }, [])

    // All dehydrators for the state.
    usePersistor(cacheData, 'cid')
    usePersistor(cacheData, 'cacheVersion')
    usePersistor(cacheData, 'lastSynchronised')
    usePersistor(cacheData, 'settings')
    usePersistor(cacheData, 'notifications')
    usePersistor(cacheData, 'announcements')
    usePersistor(cacheData, 'dealers')
    usePersistor(cacheData, 'images')
    usePersistor(cacheData, 'events')
    usePersistor(cacheData, 'eventDays')
    usePersistor(cacheData, 'eventRooms')
    usePersistor(cacheData, 'eventTracks')
    usePersistor(cacheData, 'knowledgeGroups')
    usePersistor(cacheData, 'knowledgeEntries')
    usePersistor(cacheData, 'maps')
    usePersistor(cacheData, 'communications')

    // Direct cache access methods.
    const getValue = useCallback(<T extends keyof StoreValues>(store: T): StoreValues[T] | undefined => {
        return cacheData[store]
    }, [cacheData])
    const setValue = useCallback(<T extends keyof StoreValues>(store: T, to: StoreValues[T]): void => {
        dispatch({ type: 'STORE_ACTION_VALUE_SET', key: store, value: to })
    }, [])
    const removeValue = useCallback(<T extends keyof StoreValues>(store: T): void => {
        dispatch({ type: 'STORE_ACTION_VALUE_DELETE', key: store })
    }, [])
    const getEntityKeys = useCallback(<T extends keyof StoreEntities>(store: T): StoreEntities[T]['keys'] => {
        return (cacheData[store]?.keys ?? emptyArray) as StoreEntities[T]['keys']
    }, [cacheData])
    const getEntityValues = useCallback(<T extends keyof StoreEntities>(store: T): StoreEntities[T]['values'] => {
        return (cacheData[store]?.values ?? emptyArray) as StoreEntities[T]['values']
    }, [cacheData])
    const getEntityDict = useCallback(<T extends keyof StoreEntities>(store: T): StoreEntities[T]['dict'] => {
        return cacheData[store]?.dict ?? emptyDict as StoreEntities[T]['dict']
    }, [cacheData])
    const getEntity = useCallback(<T extends keyof StoreEntities>(store: T, key: string): StoreEntities[T]['dict'][string] | undefined => {
        return cacheData[store]?.dict?.[key] as any
    }, [cacheData])


    // Clear dispatcher.
    const clear = useCallback(async () => {
        Vibration.vibrate(400)
        dispatch({ type: 'STORE_ACTION_RESET', data: {}, cause: 'cleared explicitly' })
    }, [])

    // Secondary state. Synchronizing is set from the callback according to
    // its runtime and completion. Invocation tracks an abort controller to
    // stop a running invocation if needed.
    const [isSynchronizing, setIsSynchronizing] = useState(false)
    const invocation = useRef<AbortController | null>(null)

    // Synchronization function.
    const synchronize = useCallback(
        async () => {
            const ownInvocation = new AbortController()
            invocation.current?.abort()
            invocation.current = ownInvocation
            setIsSynchronizing(true)

            const { lastSynchronised, cid, cacheVersion } = cacheDataRef.current

            // Sync fully if state is for a different convention.
            const path = lastSynchronised && cid === conId && cacheVersion === eurofurenceCacheVersion ? `Sync?since=${(lastSynchronised)}` : `Sync`

            try {
                const response = await fetch(`${apiBase}/${path}`, { signal: ownInvocation.signal })
                if (!response.ok) {
                    throw new Error('API response not OK')
                }
                if (!response.headers.get('Content-type')?.includes('application/json')) {
                    throw new Error('API response is not JSON')
                }
                const data = await response.json()

                if (syncDebug) {
                    console.log('API Response structure:', Object.keys(data))
                    console.log('Events structure:', data.Events ? Object.keys(data.Events) : 'No Events data')
                }

                // Convention identifier switched, transfer new one and clear all data irrespective of the clear data flag.
                if (data.ConventionIdentifier !== conId || cacheVersion !== eurofurenceCacheVersion) {
                    dispatch({ type: 'STORE_ACTION_RESET', data: {}, cause: 'CID or format change' })
                    dispatch({
                        type: 'STORE_ACTION_INTERNALS_SET', value: {
                            cid: conId,
                            cacheVersion: eurofurenceCacheVersion,
                            lastSynchronised: lastSynchronised,
                        },
                    })
                }

                function dispatchFromRemote<T extends keyof StoreEntities>(store: T, change: {
                    RemoveAllBeforeInsert: boolean;
                    ChangedEntities?: StoreEntityType<T>[];
                    DeletedEntities?: string[];
                }) {
                    dispatch({
                        type: 'STORE_ACTION_ENTITIES_CHANGE',
                        key: store,
                        removeAll: change.RemoveAllBeforeInsert,
                        remove: change.DeletedEntities,
                        add: change.ChangedEntities,
                    })
                }

                // Add sync tasks for each data type
                dispatchFromRemote('events', data.Events)
                dispatchFromRemote('eventDays', data.EventConferenceDays)
                dispatchFromRemote('eventRooms', data.EventConferenceRooms)
                dispatchFromRemote('eventTracks', data.EventConferenceTracks)
                dispatchFromRemote('knowledgeGroups', data.KnowledgeGroups)
                dispatchFromRemote('knowledgeEntries', data.KnowledgeEntries)
                dispatchFromRemote('dealers', data.Dealers)
                dispatchFromRemote('images', data.Images)
                dispatchFromRemote('announcements', data.Announcements)
                dispatchFromRemote('maps', data.Maps)

                dispatch({
                    type: 'STORE_ACTION_INTERNALS_SET', value: {
                        cid: conId,
                        cacheVersion: eurofurenceCacheVersion,
                        lastSynchronised: data.CurrentDateTimeUtc,
                    },
                })

                if (postSync)
                    dispatch({
                        type: 'STORE_ACTION_RESET',
                        data: await postSync(cacheDataRef.current),
                        cause: 'post sync action',
                    })
            } finally {
                if (invocation.current === ownInvocation) {
                    setIsSynchronizing(false)
                }
            }
        },
        [postSync])

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
        [synchronize],
    )

    // Run synchronize initially.
    useEffect(() => {
        if (initialized)
            synchronize().catch(console.error)
    }, [initialized, synchronize])

    // Provided context value.
    const contextValue = useMemo((): RawCacheContextType => ({
            cacheData,
            getValue,
            setValue,
            removeValue,
            getEntityKeys,
            getEntityValues,
            getEntityDict,
            getEntity,
            clear,
            isSynchronizing,
            synchronize,
            synchronizeUi,
        }),
        [cacheData, clear, getEntity, getEntityDict, getEntityKeys, getEntityValues, getValue, isSynchronizing, removeValue, setValue, synchronize, synchronizeUi],
    )

    return <RawCacheContext.Provider value={contextValue}>
        {initialized ? children : null}
    </RawCacheContext.Provider>
}

/**
 * Uses the raw cache data. Consider using `useCache` instead.
 */
export const useRawCache = () => {
    const context = useContext(RawCacheContext)
    if (!context)
        throw new Error('useRawCache must be used within a RawCacheProvider')
    return context
}
