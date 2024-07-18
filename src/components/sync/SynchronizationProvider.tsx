import { noop } from "lodash";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Vibration } from "react-native";

import { apiBase, conId } from "../../configuration";
import { useAppDispatch, useAppSelector } from "../../store";
import { selectIsSynchronized } from "../../store/eurofurence/selectors/sync";
import { applySync, eurofurenceCacheVersion, resetCache, startCacheSync } from "../../store/eurofurence/slice";

type SynchronizationProviderProps = {
    /**
     * Call this function to trigger a synchronization step.
     */
    synchronize: (vibrate?: boolean) => void;

    /**
     * Clear the entire cache and start over again.
     */
    clear: () => void;
};

const SynchronizationContext = createContext<SynchronizationProviderProps>({
    synchronize: noop,
    clear: noop,
});

export const SynchronizationProvider: FC<PropsWithChildren> = ({ children }) => {
    const dispatch = useAppDispatch();
    const cid = useAppSelector((state) => state.eurofurenceCache.cid);
    const cacheVersion = useAppSelector((state) => state.eurofurenceCache.cacheVersion);
    const lastFetch = useAppSelector((state) => state.eurofurenceCache.lastSynchronised);
    const [count, setCount] = useState(1);

    useEffect(() => {
        // Sync fully if state is for a different convention.
        const path = cid === conId && cacheVersion === eurofurenceCacheVersion ? `Sync?since=${lastFetch}` : `Sync`;

        // Fetch and apply.
        fetch(`${apiBase}/${path}`)
            .then((r) => r.json())
            .then((data) => dispatch(applySync(data)))
            .catch(console.error);
    }, [cid, cacheVersion, count]);

    const synchronize = useCallback((vibrate: boolean = true) => {
        dispatch(startCacheSync());
        if (vibrate) Vibration.vibrate(150);
        setCount((c) => c + 1);
    }, []);

    const clear = useCallback(() => {
        Vibration.vibrate(400);
        dispatch(resetCache());
        synchronize();
    }, [dispatch]);

    const providerValues = useMemo(
        (): SynchronizationProviderProps => ({
            synchronize,
            clear,
        }),
        [synchronize],
    );

    return <SynchronizationContext.Provider value={providerValues}>{children}</SynchronizationContext.Provider>;
};

export const useSynchronizer = () => {
    const context = useContext(SynchronizationContext);
    const isSynchronizing = useAppSelector(selectIsSynchronized);
    return { ...context, isSynchronizing };
};
