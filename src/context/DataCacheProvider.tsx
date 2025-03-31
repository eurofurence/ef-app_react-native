import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Platform, Vibration } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isAfter, parseISO } from "date-fns";
import { apiBase, cacheDebug, conId, conTimeZone, eurofurenceCacheVersion, syncDebug } from "@/configuration";
import { cancelEventReminder, rescheduleEventReminder } from "@/util/eventReminders";
import {
    AnnouncementDetails,
    AnnouncementRecord,
    CacheItem,
    CommunicationRecord,
    DealerDetails,
    DealerRecord,
    EventDayDetails,
    EventDayRecord,
    EventDetails,
    EventRecord,
    EventRoomDetails,
    EventTrackDetails,
    ImageDetails,
    KnowledgeEntryDetails,
    KnowledgeGroupDetails,
    MapDetails,
    MapEntryDetails,
    MapRecord,
    RecordId
} from "@/store/eurofurence/types";
import { Notification } from "@/store/background/slice";
import {
    internalAttendanceDayNames,
    internalAttendanceDays,
    internalCategorizeTime,
    internalDealerParseDescriptionContent,
    internalDealerParseTable,
    internalFixedTitle,
    internalMaskRequired,
    internalMastodonHandleToProfileUrl,
    internalSponsorOnly,
    internalSuperSponsorOnly,
    internalTagsToBadges,
    internalTagsToIcon
} from "@/store/eurofurence/details";
import { ThemeName } from "@/context/Theme";
import { toZonedTime } from "date-fns-tz";
import { chain } from "lodash";

// Define store names as const to enable literal type inference
export const STORE_NAMES = {
    ANNOUNCEMENTS: "announcements",
    NOTIFICATIONS: "notifications",
    DEALERS: "dealers",
    IMAGES: "images",
    SETTINGS: "settings",
    FUSE_SEARCH: "fuseSearch",
    EVENTS: "events",
    EVENT_DAYS: "eventDays",
    EVENT_ROOMS: "eventRooms",
    EVENT_TRACKS: "eventTracks",
    KNOWLEDGE_GROUPS: "knowledgeGroups",
    KNOWLEDGE_ENTRIES: "knowledgeEntries",
    MAPS: "maps",
    TIMETRAVEL: "timetravel",
    WARNINGS: "warnings",
    COMMUNICATIONS: "communications"
} as const;

// Create type for store names
export type StoreNames = typeof STORE_NAMES[keyof typeof STORE_NAMES];

// Define the data types for each store
export interface StoreTypes {
    [STORE_NAMES.ANNOUNCEMENTS]: AnnouncementDetails;
    [STORE_NAMES.NOTIFICATIONS]: Notification;
    [STORE_NAMES.DEALERS]: DealerDetails;
    [STORE_NAMES.IMAGES]: ImageDetails;
    [STORE_NAMES.SETTINGS]: {
        cid: string;
        cacheVersion: number;
        lastSynchronised: string;
        lastViewTimes: Record<string, string>;
        theme?: ThemeName;
        analytics?: {
            enabled: boolean;
        };
        devMenu?: boolean;
        language?: string;
        hiddenEvents?: string[];
        state?: any;
    };
    [STORE_NAMES.FUSE_SEARCH]: any;
    [STORE_NAMES.EVENTS]: EventDetails;
    [STORE_NAMES.EVENT_DAYS]: EventDayDetails;
    [STORE_NAMES.EVENT_ROOMS]: EventRoomDetails; // Replace with proper type
    [STORE_NAMES.EVENT_TRACKS]: EventTrackDetails; // Replace with proper type
    [STORE_NAMES.KNOWLEDGE_GROUPS]: KnowledgeGroupDetails;
    [STORE_NAMES.KNOWLEDGE_ENTRIES]: KnowledgeEntryDetails;
    [STORE_NAMES.MAPS]: MapDetails;
    [STORE_NAMES.TIMETRAVEL]: number;
    [STORE_NAMES.WARNINGS]: Record<string, boolean>;
    [STORE_NAMES.COMMUNICATIONS]: CommunicationRecord;
}

export interface StoreKeys {
    [STORE_NAMES.ANNOUNCEMENTS]: RecordId;
    [STORE_NAMES.NOTIFICATIONS]: RecordId;
    [STORE_NAMES.DEALERS]: RecordId;
    [STORE_NAMES.IMAGES]: RecordId;
    [STORE_NAMES.SETTINGS]: "settings";
    [STORE_NAMES.FUSE_SEARCH]: any;
    [STORE_NAMES.EVENTS]: RecordId;
    [STORE_NAMES.EVENT_DAYS]: RecordId;
    [STORE_NAMES.EVENT_ROOMS]: RecordId; // Replace with proper type
    [STORE_NAMES.EVENT_TRACKS]: RecordId; // Replace with proper type
    [STORE_NAMES.KNOWLEDGE_GROUPS]: RecordId;
    [STORE_NAMES.KNOWLEDGE_ENTRIES]: RecordId;
    [STORE_NAMES.MAPS]: RecordId;
    [STORE_NAMES.TIMETRAVEL]: "timeOffset" | "offset" | "enabled";
    [STORE_NAMES.WARNINGS]: "states";
    [STORE_NAMES.COMMUNICATIONS]: RecordId;
}

const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours
const storeNames = Object.values(STORE_NAMES);

type CacheState = Record<string, any>;

type CacheAction =
    | { type: "SET_CACHE"; key: string; data: any }
    | { type: "REMOVE_CACHE"; key: string }
    | { type: "INIT_CACHE"; data: CacheState };

const cacheReducer = (state: CacheState, action: CacheAction): CacheState => {
    switch (action.type) {
        case "SET_CACHE":
            return { ...state, [action.key]: action.data };
        case "REMOVE_CACHE": {
            const newState = { ...state };
            delete newState[action.key];
            return newState;
        }
        case "INIT_CACHE":
            return { ...state, ...action.data };
        default:
            return state;
    }
};

type DataCacheContextType = {
    getCache: <T extends StoreNames>(storeName: T, key: StoreKeys[T]) => Promise<CacheItem<StoreTypes[T]> | null>;
    saveCache: <T extends StoreNames>(storeName: T, key: StoreKeys[T], data: StoreTypes[T]) => void;
    removeCache: <T extends StoreNames>(storeName: T, key: StoreKeys[T]) => void;
    getCacheSync: <T extends StoreNames>(storeName: T, key: StoreKeys[T]) => CacheItem<StoreTypes[T]> | null;
    getAllCacheSync: <T extends StoreNames>(storeName: T) => CacheItem<StoreTypes[T]>[];
    getAllCache: <T extends StoreNames>(storeName: T) => Promise<CacheItem<StoreTypes[T]>[]>;
    saveAllCache: <T extends StoreNames>(storeName: T, data: StoreTypes[T][]) => void;
    containsKey: <T extends StoreNames>(storeName: T, key: StoreKeys[T]) => Promise<boolean>;
    isSynchronizing: boolean;
    synchronize: () => Promise<void>;
    synchronizeUi: (vibrate?: boolean) => Promise<void>;
    clear: () => Promise<void>;
};

const DataCacheContext = createContext<DataCacheContextType | undefined>(undefined);

// Cross-Platform Storage
const storage = {
    async getItem(key: string) {
        if (Platform.OS === "web") {
            return localStorage.getItem(key);
        } else {
            return await AsyncStorage.getItem(key);
        }
    },
    async setItem(key: string, value: string) {
        if (Platform.OS === "web") {
            localStorage.setItem(key, value);
        } else {
            await AsyncStorage.setItem(key, value);
        }
    }
};

// TODO:
//   Cache entry architecture, poor mans entity adapter?
//   We would like per key lookup and listing
//   Dicts and lists should be stable unless changed (use in memos)
//   Derived data, how to handle that? Rethink the arch of detail apply. If we can resolve no cost on frontend, then we don't need details??

function applyEventDayDetails(source: EventDayRecord): EventDayDetails {
    return {
        ...source,
        DayOfWeek: toZonedTime(parseISO(source.Date), conTimeZone).getDay()
    };
}

function applyAnnouncementDetails(cacheData: CacheState, source: AnnouncementRecord): AnnouncementDetails {
    return {
        ...source,
        NormalizedTitle: internalFixedTitle(source.Title, source.Content),
        Image: source.ImageId ? cacheData[`${STORE_NAMES.IMAGES}-${source.ImageId}`].data : undefined
    };
}

function applyEventDetails(cacheData: CacheState, source: EventRecord, favoriteIds: RecordId[], hiddenIds: RecordId[]): EventDetails {
    return ({
        ...source,
        PartOfDay: internalCategorizeTime(source.StartDateTimeUtc),
        Poster: source.PosterImageId ? cacheData[`${STORE_NAMES.IMAGES}-${source.PosterImageId}`].data : undefined,
        Banner: source.BannerImageId ? cacheData[`${STORE_NAMES.IMAGES}-${source.BannerImageId}`].data : undefined,
        Badges: internalTagsToBadges(source.Tags),
        Glyph: internalTagsToIcon(source.Tags),
        SuperSponsorOnly: internalSuperSponsorOnly(source.Tags),
        SponsorOnly: internalSponsorOnly(source.Tags),
        MaskRequired: internalMaskRequired(source.Tags),
        ConferenceRoom: source.ConferenceRoomId ? cacheData[`${STORE_NAMES.EVENT_ROOMS}-${source.ConferenceRoomId}`].data : undefined,
        ConferenceDay: source.ConferenceDayId ? cacheData[`${STORE_NAMES.EVENT_DAYS}-${source.ConferenceDayId}`].data : undefined,
        ConferenceTrack: source.ConferenceTrackId ? cacheData[`${STORE_NAMES.EVENT_TRACKS}-${source.ConferenceTrackId}`].data : undefined,
        Favorite: favoriteIds.includes(source.Id),
        Hidden: hiddenIds.includes(source.Id)
    });
}

function applyDealerDetails(cacheData: CacheState, source: DealerRecord, eventDays: EventDayDetails[]): DealerDetails {
    return {
        ...source,
        AttendanceDayNames: internalAttendanceDayNames(source),
        AttendanceDays: internalAttendanceDays(eventDays, source),
        Artist: source.ArtistImageId ? cacheData[`${STORE_NAMES.IMAGES}-${source.ArtistImageId}`].data : undefined,
        ArtistThumbnail: source.ArtistThumbnailImageId ? cacheData[`${STORE_NAMES.IMAGES}-${source.ArtistThumbnailImageId}`].data : undefined,
        ArtPreview: source.ArtPreviewImageId ? cacheData[`${STORE_NAMES.IMAGES}-${source.ArtPreviewImageId}`].data : undefined,
        ShortDescriptionTable: internalDealerParseTable(source),
        ShortDescriptionContent: internalDealerParseDescriptionContent(source),
        Favorite: false /* TODO */,
        MastodonUrl: !source.MastodonHandle ? undefined : internalMastodonHandleToProfileUrl(source.MastodonHandle)
    };
}

function applyMapDetails(cacheData: CacheState, source: MapRecord): MapDetails {
    return {
        ...source,
        Image: cacheData[`${STORE_NAMES.IMAGES}-${source.ImageId}`].data,
        Entries: source.Entries as MapEntryDetails[]
    };
}

export const defaultSettings: StoreTypes["settings"] = {
    cid: "",
    cacheVersion: eurofurenceCacheVersion,
    lastSynchronised: "",
    lastViewTimes: {}
} as const;

function isCacheExpired(timestamp: number) {
    return Date.now() - timestamp > CACHE_EXPIRATION_TIME;
}

export const DataCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [cacheData, dispatch] = useReducer(cacheReducer, {});
    const [isSynchronizing, setIsSynchronizing] = useState(false);
    const invocation = useRef<AbortController | null>(null);

    const getAllCache = useCallback(
        async <T extends StoreNames>(storeName: T): Promise<CacheItem<StoreTypes[T]>[]> => {
            const cache = await storage.getItem(storeName);
            if (!cache) return [];
            const parsedCache = JSON.parse(cache) as Record<string, CacheItem<StoreTypes[T]>>;

            return chain(parsedCache)
                .values()
                .filter(item => item && !isCacheExpired(item.timestamp))
                .value();
        },
        []);

    const getCache = useCallback(
        async <T extends StoreNames>(storeName: T, key: StoreKeys[T]): Promise<CacheItem<StoreTypes[T]> | null> => {
            const cache = await storage.getItem(storeName);
            if (!cache) return null;

            const parsedCache = JSON.parse(cache);
            const item = parsedCache[key];

            if (item && !isCacheExpired(item.timestamp)) {
                return item;
            }

            if (item) {
                delete parsedCache[key];
                await storage.setItem(storeName, JSON.stringify(parsedCache));
                dispatch({ type: "REMOVE_CACHE", key: `${storeName}-${key}` });
            }
            return null;
        },
        []);

    const saveAllCache = useCallback(
        async <T extends StoreNames>(storeName: T, data: StoreTypes[T][]) => {
            if (!Array.isArray(data)) {
                console.warn(`Invalid data format for ${storeName}: expected array but got ${typeof data}`);
                return;
            }

            const now = Date.now();
            const cache = data.reduce(
                (acc, item) => {
                    // @ts-expect-error: We know that item has an "Id" property, fix types later
                    acc[item["Id"]] = { data: item, timestamp: now };
                    return acc;
                },
                {} as Record<string, CacheItem<T>>
            );

            await storage.setItem(storeName, JSON.stringify(cache));

            dispatch({ type: "INIT_CACHE", data: cache });
        },
        []);

    const saveCache = useCallback(
        async <T extends StoreNames>(storeName: T, key: StoreKeys[T], data: StoreTypes[T]) => {
            if (data === undefined) return; // Do not save undefined values

            const now = Date.now();
            const cacheItem = { data, timestamp: now };
            const cache = await storage.getItem(storeName);
            const parsedCache = cache ? JSON.parse(cache) : {};

            parsedCache[key] = cacheItem;
            await storage.setItem(storeName, JSON.stringify(parsedCache));

            dispatch({ type: "SET_CACHE", key: `${storeName}-${key}`, data: cacheItem });
        },
        []);

    const updateSettings = useCallback(
        async (values: Partial<StoreTypes["settings"]>) => {
            const settings = (await getCache("settings", "settings"))?.data ?? defaultSettings;
            const newSettings = { ...settings, ...values };
            await saveCache("settings", "settings", newSettings);
        },
        [getCache, saveCache]);

    const removeCache = useCallback(
        async <T extends StoreNames>(storeName: T, key: StoreKeys[T]) => {
            const cache = await storage.getItem(storeName);
            if (!cache) return;

            const parsedCache = JSON.parse(cache);
            delete parsedCache[key];
            await storage.setItem(storeName, JSON.stringify(parsedCache));

            dispatch({ type: "REMOVE_CACHE", key: `${storeName}-${key}` });
        },
        []);

    const getCacheSync = useCallback(
        <T extends StoreNames>(storeName: T, key: StoreKeys[T]): CacheItem<StoreTypes[T]> | null => {
            const cacheKey = `${storeName}-${key}`;
            const item = cacheData[cacheKey];
            if (!item || isCacheExpired(item.timestamp))
                return null;

            // Apply transformations based on store type
            if (storeName === STORE_NAMES.ANNOUNCEMENTS) {
                return {
                    ...item,
                    data: applyAnnouncementDetails(cacheData, item.data)
                } as CacheItem<StoreTypes[T]>;
            }

            if (storeName === STORE_NAMES.MAPS) {
                return {
                    ...item,
                    data: applyMapDetails(cacheData, item.data)
                } as CacheItem<StoreTypes[T]>;
            }

            if (storeName === STORE_NAMES.DEALERS) {
                // const favorites: string[] = []; // TODO: Implement favorites
                const eventDays = chain(cacheData)
                    .entries()
                    .filter(([key]) => key.startsWith(`${STORE_NAMES.EVENT_DAYS}-`))
                    .map(([, value]) => applyEventDayDetails(value.data as EventDayRecord))
                    .sortBy("Date")
                    .value();
                return {
                    ...item,
                    data: applyDealerDetails(cacheData, item.data, eventDays)
                } as CacheItem<StoreTypes[T]>;
            }

            if (storeName === STORE_NAMES.EVENT_DAYS) {
                return {
                    ...item,
                    data: applyEventDayDetails(item.data)
                };
            }

            if (storeName === STORE_NAMES.EVENTS) {
                const favoriteIds = chain(cacheData)
                    .entries()
                    .filter(([key]) => key.startsWith(`${STORE_NAMES.NOTIFICATIONS}-`))
                    .map(([, value]) => (value.data as Notification).recordId)
                    .value();
                const hiddenIds: string[] = cacheData["settings-settings"]?.data?.hiddenEvents || [];
                return {
                    ...item,
                    data: applyEventDetails(cacheData, item.data, favoriteIds, hiddenIds)
                } as CacheItem<StoreTypes[T]>;
            }

            return item;
        },
        [cacheData]);

    const getAllCacheSync = useCallback(
        <T extends StoreNames>(storeName: T): CacheItem<StoreTypes[T]>[] => {
            // Filter all cache entries that start with the storeName prefix
            const storeEntries = chain(cacheData)
                .entries()
                .filter(([key]) => key.startsWith(`${storeName}-`))
                .map(([, value]) => value)
                .filter(item => item && !isCacheExpired(item.timestamp));

            // Apply transformations based on store type
            if (storeName === STORE_NAMES.ANNOUNCEMENTS) {
                return storeEntries.map(item => ({
                    ...item,
                    data: applyAnnouncementDetails(cacheData, item.data)
                })).value() as CacheItem<StoreTypes[T]>[];
            }
            if (storeName === STORE_NAMES.MAPS) {
                return storeEntries.map(item => ({
                    ...item,
                    data: applyMapDetails(cacheData, item.data)
                })).value() as CacheItem<StoreTypes[T]>[];
            }
            if (storeName === STORE_NAMES.DEALERS) {
                const eventDays = chain(cacheData)
                    .entries()
                    .filter(([key]) => key.startsWith(`${STORE_NAMES.EVENT_DAYS}-`))
                    .map(([, value]) => applyEventDayDetails(value.data as EventDayRecord))
                    .sortBy("Date")
                    .value();
                return storeEntries.map(item => ({
                    ...item,
                    data: applyDealerDetails(cacheData, item.data, eventDays)
                })).value() as CacheItem<StoreTypes[T]>[];
            }
            if (storeName === STORE_NAMES.EVENTS) {
                const favoriteIds = chain(cacheData)
                    .entries()
                    .filter(([key]) => key.startsWith(`${STORE_NAMES.NOTIFICATIONS}-`))
                    .map(([, value]) => (value.data as Notification).recordId)
                    .value();
                const hiddenIds: string[] = cacheData["settings-settings"]?.data?.hiddenEvents || [];
                return storeEntries.map(item => ({
                    ...item,
                    data: applyEventDetails(cacheData, item.data, favoriteIds, hiddenIds)
                })).value() as CacheItem<StoreTypes[T]>[];
            }

            return storeEntries.value();
        },
        [cacheData]);

    const containsKey = useCallback(
        async <T extends StoreNames>(storeName: T, key: StoreKeys[T]): Promise<boolean> => {
            const cache = await storage.getItem(storeName);
            if (!cache) return false;

            const parsedCache = JSON.parse(cache);
            return key in parsedCache;
        },
        []);

    const clear = useCallback(async () => {
        Vibration.vibrate(400);
        // Clear all caches for each storeName
        for (const storeName of storeNames) {
            await storage.setItem(storeName, JSON.stringify({}));
        }
        dispatch({ type: "INIT_CACHE", data: {} });
    }, []);

    // Synchronization functions
    const synchronize = useCallback(
        async () => {
            const ownInvocation = new AbortController();
            invocation.current?.abort();
            invocation.current = ownInvocation;
            setIsSynchronizing(true);

            // Retrieve last synchronised time and other auxiliary values from cache
            const settings = (await getCache("settings", "settings"))?.data ?? defaultSettings;

            // Sync fully if state is for a different convention.
            const path = settings.lastSynchronised && settings.cid === conId && settings.cacheVersion === eurofurenceCacheVersion ? `Sync?since=${(settings.lastSynchronised)}` : `Sync`;

            try {
                const response = await fetch(`${apiBase}/${path}`, { signal: ownInvocation.signal });
                if (!response.ok) {
                    throw new Error("API response not OK");
                }
                if (!response.headers.get("Content-type")?.includes("application/json")) {
                    throw new Error("API response is not JSON");
                }
                const data = await response.json();
                if (syncDebug) {
                    console.log("API Response structure:", Object.keys(data));
                    console.log("Events structure:", data.Events ? Object.keys(data.Events) : "No Events data");
                }

                // Convention identifier switched, transfer new one and clear all data irrespective of the clear data flag.
                if (data.ConventionIdentifier !== conId || settings.cacheVersion !== eurofurenceCacheVersion) {
                    console.log(data.ConventionIdentifier, conId);
                    await clear();
                    // Set the new cache version after clearing
                    await updateSettings({ cacheVersion: eurofurenceCacheVersion });
                }

                // Apply sync to each storeName with Promise.all
                const syncPromises: Promise<void>[] = [];
                const debugInfo: Record<string, string> = {};

                // Helper function to safely add sync tasks
                const addSyncTask = <T extends StoreNames>(storeName: T, dataObject: {
                    StorageLastChangeDateTimeUtc: string;
                    StorageDeltaStartChangeDateTimeUtc: string;
                    RemoveAllBeforeInsert: boolean;
                    ChangedEntities?: StoreTypes[T][];
                    DeletedEntities?: string[];
                }) => {
                    if (!dataObject) return;

                    syncPromises.push((async () => {
                        if (dataObject.RemoveAllBeforeInsert) {
                            // Fresh assignment is requested, delete all items in the given store and set to new state.
                            await saveAllCache(storeName, dataObject.ChangedEntities ?? []);
                            debugInfo[storeName] = `reset with ${dataObject.ChangedEntities?.length}`;
                        } else if (dataObject.DeletedEntities?.length || dataObject.ChangedEntities?.length) {
                            // Get current entries. Filter deleted and try to add changed.
                            const items = await getAllCache(storeName);
                            const next = Iterator.from(items)
                                .map(item => item.data)
                                .filter(item => !dataObject.DeletedEntities?.includes(item.Id))
                                .toArray();
                            if (dataObject.ChangedEntities?.length)
                                next.push(...dataObject.ChangedEntities);

                            // Save all.
                            await saveAllCache(storeName, dataObject.ChangedEntities ?? []);
                            debugInfo[storeName] = `delete ${dataObject.DeletedEntities?.length ?? 0}, add ${dataObject.ChangedEntities?.length ?? 0}`;
                        }
                    })());
                };

                // Add sync tasks for each data type
                addSyncTask("events", data.Events);
                addSyncTask("eventDays", data.EventConferenceDays);
                addSyncTask("eventRooms", data.EventConferenceRooms);
                addSyncTask("eventTracks", data.EventConferenceTracks);
                addSyncTask("knowledgeGroups", data.KnowledgeGroups);
                addSyncTask("knowledgeEntries", data.KnowledgeEntries);
                addSyncTask("dealers", data.Dealers);
                addSyncTask("images", data.Images);
                addSyncTask("announcements", data.Announcements);
                addSyncTask("maps", data.Maps);

                // Wait for all sync tasks to complete
                await Promise.all(syncPromises);

                // Cache debugging is set to true, log the info we received.
                if (cacheDebug) {
                    console.log("Cache Sync Summary:", {
                        stores: debugInfo,
                        settings: {
                            conventionId: data.ConventionIdentifier || "not set",
                            cacheVersion: eurofurenceCacheVersion,
                            lastSyncTime: data.CurrentDateTimeUtc || "not set",
                            hasState: !!data.State
                        }
                    });
                }

                // Synced, commit settings. TODO: Move to a "cache state" store entry?
                await updateSettings({
                    cid: data.ConventionIdentifier,
                    cacheVersion: eurofurenceCacheVersion,
                    lastSynchronised: data.CurrentDateTimeUtc,
                    state: data.State
                });

                // Reschedule each event reminder
                const eventCache = await getAllCache("events");
                const notificationsCache = await getAllCache("notifications");

                for (const reminder of notificationsCache) {
                    const reminderData = reminder.data;
                    // Find event corresponding to reminder.recordId in eventCache using the correct property
                    const eventEntry = eventCache.find((item: any) => item.data.Id === reminderData.recordId);
                    const event = eventEntry ? eventEntry.data : null;
                    if (event) {
                        if (isAfter(parseISO(event.LastChangeDateTimeUtc), parseISO(reminderData.dateCreatedUtc))) {
                            // Reschedule reminder; timeTravel default to 0 for now.
                            await rescheduleEventReminder(event, 0, saveCache, removeCache).catch((error) => console.warn("Reschedule error:", error));
                        }
                    } else {
                        // Cancel reminder if event no longer exists
                        await cancelEventReminder(reminderData.recordId, removeCache).catch((error) => console.warn("Cancel reminder error:", error));
                    }
                }
            } finally {
                if (invocation.current === ownInvocation) {
                    setIsSynchronizing(false);
                }
            }
        },
        [getCache, updateSettings, getAllCache, clear, removeCache, saveAllCache, saveCache]);

    const synchronizeUi = useCallback(
        async (vibrate: boolean = false) => {
            if (vibrate) Vibration.vibrate(400);
            try {
                return await synchronize();
            } catch (error) {
                console.warn("Synchronization error:", error);
                throw error;
            }
        },
        [synchronize]
    );

    useEffect(() => {
        const initCache = async () => {
            try {
                const cachePromises = storeNames.map((storeName) => storage.getItem(storeName));
                const cacheResults = await Promise.all(cachePromises);

                const formattedCacheData = cacheResults.reduce((acc, cache, index) => {
                    const storeName = storeNames[index];
                    const parsedCache = cache ? JSON.parse(cache) : {};
                    for (const key in parsedCache)
                        acc[`${storeName}-${key}`] = parsedCache[key];
                    return acc;
                }, {} as CacheState);

                // Initialize with default cache version if not present
                await updateSettings({ cacheVersion: eurofurenceCacheVersion });

                dispatch({ type: "INIT_CACHE", data: formattedCacheData });
                synchronizeUi();
            } catch (error) {
                console.error("Error initializing cache:", error);
            } finally {
                setLoading(false);
            }
        };

        initCache().then();
    }, [synchronizeUi, updateSettings]);


    const contextValue = useMemo(
        () => ({
            getCache,
            saveCache,
            removeCache,
            getCacheSync,
            getAllCache,
            saveAllCache,
            containsKey,
            getAllCacheSync,
            isSynchronizing,
            synchronize,
            synchronizeUi,
            clear
        }),
        [getCache, saveCache, removeCache, getCacheSync, getAllCache, saveAllCache, containsKey, getAllCacheSync, isSynchronizing, synchronize, synchronizeUi, clear]
    );

    return <DataCacheContext.Provider value={contextValue}>{loading ? null : children}</DataCacheContext.Provider>;
};

export const useDataCache = () => {
    const context = useContext(DataCacheContext);
    if (!context) {
        throw new Error("useDataCache must be used within a DataCacheProvider");
    }
    return context;
};
