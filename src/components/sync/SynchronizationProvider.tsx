import { noop } from "lodash";
import { createContext, FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Vibration } from "react-native";

import { ImageSynchronizer } from "./ImageSynchronizer";
import { apiBase, conId } from "../../configuration";
import { useAppDispatch, useAppSelector } from "../../store";
import { applySync, resetCache, startCacheSync } from "../../store/eurofurence.cache";
import { selectIsSynchronized } from "../../store/eurofurence.selectors";

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
    const lastFetch = useAppSelector((state) => state.eurofurenceCache.lastSynchronised);
    const [count, setCount] = useState(1);

    useEffect(() => {
        // Sync fully if state is for a different convention.
        const path = cid === conId ? `Sync?since=${lastFetch}` : `Sync`;

        // Fetch and apply.
        fetch(`${apiBase}/${path}`)
            .then((r) => r.json())
            .then((data) => dispatch(applySync(data)))
            .catch(console.error);
    }, [count]);

    const clearCache = useCallback(() => {
        Vibration.vibrate(400);
        dispatch(resetCache());
        synchronize();
    }, [dispatch]);

    const synchronize = useCallback((vibrate: boolean = true) => {
        dispatch(startCacheSync());
        if (vibrate) Vibration.vibrate(150);
        setCount((c) => c + 1);
    }, []);

    const providerValues = useMemo(
        (): SynchronizationProviderProps => ({
            synchronize,
            clear: clearCache,
        }),
        [synchronize],
    );

    return (
        <SynchronizationContext.Provider value={providerValues}>
            {/* TODO: Different location? */}
            <ImageSynchronizer />
            {children}
        </SynchronizationContext.Provider>
    );
};

export const useSynchronizer = () => {
    const { synchronize, clear } = useContext(SynchronizationContext);
    const isSynchronizing = useAppSelector(selectIsSynchronized);

    return {
        synchronize,
        clear,
        isSynchronizing,
    };
};
