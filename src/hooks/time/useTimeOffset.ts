import { useDataCache } from "@/context/DataCacheProvider";

/**
 * The key for the time offset.
 */
export const useTimeOffset = () => {
    const { getCacheSync, saveCache } = useDataCache();

    // Retrieve the cached time offset
    const getTimeOffset = () => {
        const cacheItem = getCacheSync("timetravel", "timeOffset");
        return cacheItem ? cacheItem.data : 0; // Default to 0 if not found
    };

    // Function to update the time offset in cache
    const setTimeOffset = (offset: number) => {
        saveCache("timetravel", "timeOffset", offset);
    };

    return { getTimeOffset, setTimeOffset };
};
