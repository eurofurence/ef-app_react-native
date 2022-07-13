import { noop } from "lodash";
import { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Vibration } from "react-native";

import { useAppDispatch, useAppSelector } from "../../store";
import { applySync, resetCache } from "../../store/eurofurence.cache";
import { PlatformImageSynchronizer } from "./ImageSynchronizer";

type SynchronizationProviderProps = {
    /**
     * Call this function to trigger a synchronization step.
     */
    synchronize: () => void;

    /**
     * Clear the entire cache and start over again.
     */
    clear: () => void;
};
const SynchronizationContext = createContext<SynchronizationProviderProps>({
    synchronize: noop,
    clear: noop,
});

export const SynchronizationProvider: FC = ({ children }) => {
    const dispatch = useAppDispatch();
    const lastFetch = useAppSelector((state) => state.eurofurenceCache.lastSynchronised);
    const [count, setCount] = useState(1);

    useEffect(() => {
        fetch(`https://app.eurofurence.org/EF26/Api/Sync?since=${lastFetch}`)
            .then((r) => r.json())
            .then((data) => dispatch(applySync(data)))
            .catch(console.error);
    }, [count]);

    const clearCache = useCallback(() => {
        Vibration.vibrate(400);
        dispatch(resetCache());
        synchronize();
    }, [dispatch]);

    const synchronize = useCallback(() => {
        Vibration.vibrate(150);
        setCount((c) => c + 1);
    }, []);

    const providerValues = useMemo(
        (): SynchronizationProviderProps => ({
            synchronize,
            clear: clearCache,
        }),
        [synchronize]
    );

    return (
        <SynchronizationContext.Provider value={providerValues}>
            <PlatformImageSynchronizer />
            {children}
        </SynchronizationContext.Provider>
    );
};

export const useSynchronizer = () => {
    return useContext(SynchronizationContext);
};
