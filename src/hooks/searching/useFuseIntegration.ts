import Fuse from "fuse.js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDataCache } from "@/context/DataCacheProvider";

/**
 * Uses a fuse search integrator.
 * @param storeKey The key to access data from the cache.
 * @param limit Maximum results.
 */
export const useFuseIntegration = <T extends object>(storeKey: string, limit = 100): [string, Dispatch<SetStateAction<string>>, T[] | null] => {
    const { getCacheSync } = useDataCache();
    const cacheItem = getCacheSync("fuseSearch", storeKey);

    const fuse = cacheItem ? new Fuse(cacheItem.data, { keys: ["name", "description"], threshold: 0.3 }) : null;

    const [filter, setFilter] = useState("");
    const [results, setResults] = useState<null | T[]>(null);

    useEffect(() => {
        if (!filter.length) {
            setResults(null);
        } else {
            const handle = setTimeout(() => {
                if (fuse) {
                    setResults(fuse.search(filter, { limit }).map((result) => result.item));
                }
            }, 60);
            return () => clearTimeout(handle);
        }
    }, [fuse, filter, limit]);

    return [filter, setFilter, results];
};
