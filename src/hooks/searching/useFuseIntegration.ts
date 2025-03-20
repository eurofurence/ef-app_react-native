import Fuse from "fuse.js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDataCache } from "@/context/DataCacheProvider";

/**
 * Uses a Fuse search integrator.
 * @param searchSource Either a store key (string) to retrieve cached data or a pre-built Fuse instance.
 * @param limit Maximum results.
 */
export const useFuseIntegration = <T extends object>(searchSource: string | Fuse<T>, limit = 100): [string, Dispatch<SetStateAction<string>>, T[] | null] => {
    // If searchSource is a string, then retrieve data from cache and create a Fuse instance.
    let fuse: Fuse<T> | null = null;
    const { getCacheSync } = useDataCache();
    if (typeof searchSource === "string") {
        const cacheItem = getCacheSync<any>("fuseSearch", searchSource);
        fuse = cacheItem ? new Fuse(cacheItem.data, { keys: ["name", "description"], threshold: 0.3 }) : null;
    } else {
        // If it's already a Fuse instance, use it directly.
        fuse = searchSource;
    }

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
