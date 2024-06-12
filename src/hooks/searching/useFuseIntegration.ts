import Fuse from "fuse.js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { useFuseFor } from "./useFuseFor";
import { RootState } from "../../store";

/**
 * Uses a fuse search integrator.
 * @param selector The selector from the  app state.
 * @param keys The keys or key objects to index.
 * @param options The search options.
 */
export const useFuseIntegration = <T extends object>(
    selector: (state: RootState) => T[],
    keys: Fuse.FuseOptionKey<T>[],
    options: Fuse.IFuseOptions<T>,
    limit = 30,
): [string, Dispatch<SetStateAction<string>>, T[] | null] => {
    // Search state.
    const fuse = useFuseFor(selector, keys, options);
    const [filter, setFilter] = useState("");
    const [results, setResults] = useState<null | T[]>(null);

    // Perform search.
    useEffect(() => {
        if (!filter.length) {
            setResults(null);
        } else {
            const handle = setTimeout(() => {
                setResults(fuse.search(filter, { limit }).map((result) => result.item));
            }, 60);
            return () => {
                clearTimeout(handle);
            };
        }
    }, [fuse, filter, limit]);

    return [filter, setFilter, results];
};
