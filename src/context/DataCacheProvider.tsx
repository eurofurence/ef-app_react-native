import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours
const storeNames = ["theme", "announcements", "dealers", "images", "timetravel", "auxiliary", "fuseSearch"];

type CacheItem<T> = {
    id: string;
    data: T;
    timestamp: number;
};

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
        return cache ? JSON.parse(cache) : [];
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
        }),
        [getCache, saveCache, removeCache, getCacheSync, getAllCache, saveAllCache, containsKey, getAllCacheSync],
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
