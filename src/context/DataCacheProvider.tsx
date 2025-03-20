import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { Platform, Vibration } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isAfter, parseISO } from "date-fns";
import { apiBase, conId, eurofurenceCacheVersion } from "@/configuration";
import { cancelEventReminder, rescheduleEventReminder } from "@/utils/eventReminders";
import { CacheItem, EventRecord } from "@/store/eurofurence/types";
import { Notification } from "@/store/background/slice";

const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours
const storeNames = ["theme", "announcements", "notifications", "dealers", "images", "settings", "fuseSearch"];

type CacheState = Record<string, any>;

type CacheAction = { type: "SET_CACHE"; key: string; data: any } | { type: "REMOVE_CACHE"; key: string } | { type: "INIT_CACHE"; data: CacheState };

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
    getCache: <T>(storeName: string, key: string) => Promise<CacheItem<T> | null>;
    saveCache: <T>(storeName: string, key: string, data: T) => void;
    removeCache: (storeName: string, key: string) => void;
    getCacheSync: <T>(storeName: string, key: string) => CacheItem<T> | null;
    getAllCacheSync: <T>(storeName: string) => CacheItem<T>[];
    getAllCache: <T>(storeName: string) => Promise<CacheItem<T>[]>;
    saveAllCache: <T>(storeName: string, data: T[]) => void;
    containsKey: (storeName: string, key: string) => Promise<boolean>;
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
    },
};

export const DataCacheProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [cacheData, dispatch] = useReducer(cacheReducer, {});
    const [isSynchronizing, setIsSynchronizing] = useState(false);
    const invocation = useRef<AbortController | null>(null);

    useEffect(() => {
        const initCache = async () => {
            try {
                const cachePromises = storeNames.map((storeName) => storage.getItem(storeName));
                const cacheResults = await Promise.all(cachePromises);

                const formattedCacheData = cacheResults.reduce((acc, cache, index) => {
                    const storeName = storeNames[index];
                    const parsedCache = cache ? JSON.parse(cache) : {};
                    Object.keys(parsedCache).forEach((key) => {
                        acc[`${storeName}-${key}`] = parsedCache[key];
                    });
                    return acc;
                }, {} as CacheState);

                dispatch({ type: "INIT_CACHE", data: formattedCacheData });
                synchronize();
            } catch (error) {
                console.error("Error initializing cache:", error);
            } finally {
                setLoading(false);
            }
        };

        initCache().then();
    }, []);

    const isCacheExpired = (timestamp: number) => Date.now() - timestamp > CACHE_EXPIRATION_TIME;

    const getAllCache = useCallback(async <T,>(storeName: string): Promise<CacheItem<T>[]> => {
        const cache = await storage.getItem(storeName);
        if (!cache) return [];
        const parsedCache = JSON.parse(cache) as Record<string, CacheItem<T>>;
        return Object.values(parsedCache).filter(item => item && !isCacheExpired(item.timestamp));
    }, []);

    const getCache = useCallback(async <T,>(storeName: string, key: string): Promise<CacheItem<T> | null> => {
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
    }, []);

    const saveAllCache = useCallback(async <T,>(storeName: string, data: T[]) => {
        const cache = data.reduce(
            (acc, item) => {
                // @ts-expect-error: We know that item has an "Id" property, fix types later
                acc[item["Id"]] = { data: item, timestamp: Date.now() };
                return acc;
            },
            {} as Record<string, CacheItem<T>>,
        );

        await storage.setItem(storeName, JSON.stringify(cache));

        dispatch({ type: "INIT_CACHE", data: cache });
    }, []);

    const saveCache = useCallback(async <T,>(storeName: string, key: string, data: T) => {
        if (data === undefined) return; // Do not save undefined values

        const cacheItem = { data, timestamp: Date.now() };
        const cache = await storage.getItem(storeName);
        const parsedCache = cache ? JSON.parse(cache) : {};

        parsedCache[key] = cacheItem;
        await storage.setItem(storeName, JSON.stringify(parsedCache));

        dispatch({ type: "SET_CACHE", key: `${storeName}-${key}`, data: cacheItem });
    }, []);

    const removeCache = useCallback(async (storeName: string, key: string) => {
        const cache = await storage.getItem(storeName);
        if (!cache) return;

        const parsedCache = JSON.parse(cache);
        delete parsedCache[key];
        await storage.setItem(storeName, JSON.stringify(parsedCache));

        dispatch({ type: "REMOVE_CACHE", key: `${storeName}-${key}` });
    }, []);

    const getCacheSync = useCallback(
        <T,>(storeName: string, key: string): CacheItem<T> | null => {
            const cacheKey = `${storeName}-${key}`;
            const item = cacheData[cacheKey];
            if (item && !isCacheExpired(item.timestamp)) {
                return item;
            }
            return null;
        },
        [cacheData],
    );

    const getAllCacheSync = useCallback(
        <T,>(storeName: string): CacheItem<T>[] => {
            const cache = cacheData[storeName];
            return cache ? Object.values(cache) : [];
        },
        [cacheData],
    );

    const containsKey = useCallback(async (storeName: string, key: string): Promise<boolean> => {
        const cache = await storage.getItem(storeName);
        if (!cache) return false;

        const parsedCache = JSON.parse(cache);
        return key in parsedCache;
    }, []);

    // Synchronization functions
    const synchronize = useCallback(async () => {
        const ownInvocation = new AbortController();
        invocation.current?.abort();
        invocation.current = ownInvocation;
        setIsSynchronizing(true);

        // Retrieve last synchronised time and other auxiliary values from cache
        const auxiliaryCache = await getCache("settings", "lastSynchronised");
        const lastSynchronised = auxiliaryCache ? auxiliaryCache.data : null;
        const cachedCid = await getCache("settings", "cid");
        const cachedCacheVersion = await getCache("settings", "cacheVersion");

        const path = lastSynchronised && cachedCid?.data === conId && cachedCacheVersion?.data === eurofurenceCacheVersion ? `Sync?since=${lastSynchronised}` : `Sync`;

        try {
            const response = await fetch(`${apiBase}/${path}`, { signal: ownInvocation.signal });
            if (!response.ok) {
                throw new Error("API response not OK");
            }
            if (!response.headers.get("Content-type")?.includes("application/json")) {
                throw new Error("API response is not JSON");
            }
            const data = await response.json();

            // Apply sync: assume data is an object with keys corresponding to storeNames
            for (const storeName of storeNames) {
                if (data[storeName]) {
                    await saveAllCache(storeName, data[storeName]);
                }
            }

            // Reschedule each event reminder
            const eventCache = await getAllCache<EventRecord>("events");
            const notificationsCache = await getAllCache<Notification>("notifications");

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
    }, [getCache, getAllCache, saveAllCache, saveCache, removeCache]);

    const clear = useCallback(async () => {
        Vibration.vibrate(400);
        // Clear all caches for each storeName
        for (const storeName of storeNames) {
            await storage.setItem(storeName, JSON.stringify({}));
        }
        dispatch({ type: "INIT_CACHE", data: {} });
        await synchronize();
    }, [synchronize]);

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
        [synchronize],
    );

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
            clear,
        }),
        [getCache, saveCache, removeCache, getCacheSync, getAllCache, saveAllCache, containsKey, getAllCacheSync, isSynchronizing, synchronize, synchronizeUi, clear],
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
