import { noop } from "lodash";
import { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Vibration } from "react-native";

import { useAppDispatch, useAppSelector } from "../../store";
import { applySync } from "../../store/eurofurence.cache";
import { ImageSynchronizer, PlatformImageSynchronizer } from "./ImageSynchronizer";

type SynchronizationProviderProps = {
    /**
     * Call this function to trigger a synchronization step.
     */
    synchronize: () => void;
};
const SynchronizationContext = createContext<SynchronizationProviderProps>({
    synchronize: noop,
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

    const synchronize = useCallback(() => {
        Vibration.vibrate(150);
        setCount((c) => c + 1);
    }, []);

    const providerValues = useMemo(
        () => ({
            synchronize,
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
