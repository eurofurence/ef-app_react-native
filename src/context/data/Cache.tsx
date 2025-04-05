import React, { createContext, ReactNode, useCallback, useContext, useEffect, useReducer, useRef, useState } from 'react'
import { Vibration } from 'react-native'
import { formatISO } from 'date-fns'
import { apiBase, cacheDebug, conId, eurofurenceCacheVersion, syncDebug } from '@/configuration'
import { Notification } from '@/store/background/slice'
import * as Storage from '@/context/data/storageBackend'
import { entitySorters } from '@/context/data/entitySorters'
import { dehydrators } from '@/context/data/dehydrators'
import { hydrators } from '@/context/data/hydrators'
import {
    AnnouncementRecord,
    CommunicationRecord,
    DealerRecord,
    EventDayRecord,
    EventRecord,
    EventRoomRecord,
    EventTrackRecord,
    ImageRecord,
    KnowledgeEntryRecord,
    KnowledgeGroupRecord,
    MapRecord,
    Settings,
} from '@/context/data/types'
import { CacheExtensions, useCacheExtensions } from '@/context/data/useCacheExtensions'
import { emptyEntityStore, EntityStore } from '@/context/data/EntityStore'

/**
 * Internal values stored in the cache. Used for operation of the sync mechanism.
 */
export type StoreInternals = Readonly<{
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
}>

/**
 * Direct value stores in the cache. These values are persisted and loaded
 * as-is.
 */
export type StoreValues = Readonly<{
    /**
     * User settings.
     */
    settings: Settings;

    /**
     * Currently registered notifications (i.e., event reminders).
     */
    notifications: readonly Notification[];
}>

/**
 * Resolved raw entity data.
 */
export type StoreEntities = Readonly<{
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
}>

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
export type StoreEntityType<T extends keyof StoreEntities> = StoreEntities[T][number]

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
    data: StoreData,
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


const initialState: StoreData = {
    cid: 'none',
    cacheVersion: eurofurenceCacheVersion,
    lastSynchronised: formatISO(0),
    settings: {},
    notifications: [],
    announcements: emptyEntityStore,
    dealers: emptyEntityStore,
    images: emptyEntityStore,
    events: emptyEntityStore,
    eventDays: emptyEntityStore,
    eventRooms: emptyEntityStore,
    eventTracks: emptyEntityStore,
    knowledgeGroups: emptyEntityStore,
    knowledgeEntries: emptyEntityStore,
    maps: emptyEntityStore,
    communications: emptyEntityStore,
}
/**
 * Reducer for store state and cache related actions.
 * @param state Current state.
 * @param action Action to apply.
 */
const storeReducer = (state: StoreData, action: StoreAction): StoreData => {
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
                const sorter = entitySorters[action.key]
                const values = []
                if (action.add) {
                    values.push(...action.add)
                    values.sort(sorter as any)
                }

                // Derive secondaries.
                const dict: Record<string, (typeof values)[number]> = {}
                for (const item of values)
                    dict[item.Id] = item

                return { ...state, [action.key]: Object.assign(values, { dict }) }
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
                const sorter = entitySorters[action.key]
                const values = currentOrDefault.filter(item => !deleteKeys.has(item.Id))
                if (action.add) {
                    values.push(...action.add)
                    values.sort(sorter as any)
                }

                // Derive secondaries.
                const dict: Record<string, (typeof values)[number]> = {}
                for (const item of values)
                    dict[item.Id] = item

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
function usePersistor<T extends keyof StoreData>(data: StoreData, store: T, debounce = 100) {
    const location = data[store]
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            Storage.set(store, dehydrators[store](location))
        }, debounce)
        return () => {
            clearTimeout(timeoutId)
        }
    }, [location, store, debounce])
}


/**
 * Cache context.
 */
export type CacheContextType = {
    /**
     * Raw store data, including un-extended entity records.
     */
    data: StoreData;

    /**
     * Gets a "value type" store value.
     * @param store The name of the store.
     */
    // todo: Implicit change semantics is not really optimal. do we need to have the data in there like we have extensions?
    getValue<T extends keyof StoreValues>(store: T): StoreValues[T];

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
} & CacheExtensions;

/**
 * Context object.
 */
const CacheContext = createContext<CacheContextType | undefined>(undefined)
CacheContext.displayName = 'CacheContext'

export type CacheProps = {
    children?: ReactNode | undefined;
}

/**
 * Provides raw cache integration.
 * @param children The children this context is provided to. May not be rendered
 * if the state is not available yet.
 * @constructor
 */
export const CacheProvider = ({ children }: CacheProps) => {
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
        Storage.multiGet(StoreKeys).then(stored => {
            if (!go) return
            // Hydrate all and dispatch ready state.
            const data: StoreData = { ...initialState }
            for (const [key, value] of stored)
                if (value !== null)
                    (data as Record<string, any>)[key] = hydrators[key as keyof StoreData](value)

            // Dispatch init.
            dispatch({
                type: 'STORE_ACTION_RESET', data: data, cause: 'init',
            })
        }).catch(() => {
            if (!go) return

            // Safety fallback clean store.
            Storage.multiSet([
                ['cid', dehydrators['cid'](initialState['cid'])],
                ['cacheVersion', dehydrators['cacheVersion'](initialState['cacheVersion'])],
                ['lastSynchronised', dehydrators['lastSynchronised'](initialState['lastSynchronised'])],
                ['settings', dehydrators['settings'](initialState['settings'])],
                ['notifications', dehydrators['notifications'](initialState['notifications'])],
                ['announcements', dehydrators['announcements'](initialState['announcements'])],
                ['dealers', dehydrators['dealers'](initialState['dealers'])],
                ['images', dehydrators['images'](initialState['images'])],
                ['events', dehydrators['events'](initialState['events'])],
                ['eventDays', dehydrators['eventDays'](initialState['eventDays'])],
                ['eventRooms', dehydrators['eventRooms'](initialState['eventRooms'])],
                ['eventTracks', dehydrators['eventTracks'](initialState['eventTracks'])],
                ['knowledgeGroups', dehydrators['knowledgeGroups'](initialState['knowledgeGroups'])],
                ['knowledgeEntries', dehydrators['knowledgeEntries'](initialState['knowledgeEntries'])],
                ['maps', dehydrators['maps'](initialState['maps'])],
                ['communications', dehydrators['communications'](initialState['communications'])],
            ]).catch()
            dispatch({
                type: 'STORE_ACTION_RESET', data: initialState, cause: 'init error',
            })
        }).finally(() => {
            setInitialized(true)
        })

        return () => {
            go = false
        }
    }, [])

    // All dehydrators for the state.
    usePersistor(data, 'cid')
    usePersistor(data, 'cacheVersion')
    usePersistor(data, 'lastSynchronised')
    usePersistor(data, 'settings')
    usePersistor(data, 'notifications')
    usePersistor(data, 'announcements')
    usePersistor(data, 'dealers')
    usePersistor(data, 'images')
    usePersistor(data, 'events')
    usePersistor(data, 'eventDays')
    usePersistor(data, 'eventRooms')
    usePersistor(data, 'eventTracks')
    usePersistor(data, 'knowledgeGroups')
    usePersistor(data, 'knowledgeEntries')
    usePersistor(data, 'maps')
    usePersistor(data, 'communications')

    // Direct cache access methods.
    const getValue = useCallback(<T extends keyof StoreValues>(store: T): StoreValues[T] => {
        return data[store]
    }, [data])
    const setValue = useCallback(<T extends keyof StoreValues>(store: T, to: StoreValues[T]): void => {
        dispatch({ type: 'STORE_ACTION_VALUE_SET', key: store, value: to })
    }, [])
    const removeValue = useCallback(<T extends keyof StoreValues>(store: T): void => {
        dispatch({ type: 'STORE_ACTION_VALUE_DELETE', key: store })
    }, [])

    // Clear dispatcher.
    const clear = useCallback(async () => {
        Vibration.vibrate(400)
        dispatch({ type: 'STORE_ACTION_RESET', data: initialState, cause: 'cleared explicitly' })
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

            const { lastSynchronised, cid, cacheVersion } = dataRef.current

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
                    dispatch({ type: 'STORE_ACTION_RESET', data: initialState, cause: 'CID or format change' })
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
            } finally {
                if (invocation.current === ownInvocation) {
                    setIsSynchronizing(false)
                }
            }
        },
        [])

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

    // Use extensions.
    const extensions = useCacheExtensions(data)

    // TODO: All the data usually changes together, I've removed the memo as that's
    //   just dependency tracking overhead.
    return <CacheContext.Provider value={{
        data,
        getValue,
        setValue,
        removeValue,
        clear,
        isSynchronizing,
        synchronize,
        synchronizeUi,
        ...extensions,
    }}>
        {initialized ? children : null}
    </CacheContext.Provider>
}

/**
 * Uses the raw cache data. Consider using `useCache` instead.
 */
export const useCache = () => {
    const context = useContext(CacheContext)
    if (!context)
        throw new Error('useCache must be used within a CacheProvider')
    return context
}
