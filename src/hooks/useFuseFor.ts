import Fuse from "fuse.js";
import { useMemo } from "react";

import { useStable } from "./useStable";
import { RootState, useAppSelector } from "../store";

/**
 * Uses a fuse search object for the given data.
 * @param selector The selector from the  app state.
 * @param keys The keys or key objects to index.
 * @param options The search options.
 */
export const useFuseFor = <T extends object>(selector: (state: RootState) => T[], keys: Fuse.FuseOptionKey<T>[], options: Fuse.IFuseOptions<T>) => {
    // Use stable keys and options, these are passed as an array and an object.
    const stableKeys = useStable(keys);
    const stableOptions = useStable(options);

    // Get data from selector.
    const data = useAppSelector(selector);

    // Create index.
    const index = useMemo(() => Fuse.createIndex(stableKeys, data), [stableKeys, data]);

    // Return a new fuse instance based on these values.
    return useMemo(() => new Fuse(data, stableOptions, index), [data, stableOptions, index]);
};
