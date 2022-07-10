import { noop } from "lodash";
import { createContext, FC, useContext, useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../store";
import { applySync } from "../../store/eurofurence.cache";

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

    return <SynchronizationContext.Provider value={{ synchronize: () => setCount((c) => c + 1) }}>{children}</SynchronizationContext.Provider>;
};

export const useSynchronizer = () => {
    return useContext(SynchronizationContext);
};
