import Fuse from "fuse.js";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { RootState, useAppSelector } from "../../store";

/**
 * Uses a fuse search integrator.
 * @param selector The selector from the  app state.
 * @param limit Maximum results.
 */
export const useFuseIntegration = <T extends object>(selector: (state: RootState) => Fuse<T>, limit = 30): [string, Dispatch<SetStateAction<string>>, T[] | null] => {
    // Search state.
    const fuse = useAppSelector(selector);
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
