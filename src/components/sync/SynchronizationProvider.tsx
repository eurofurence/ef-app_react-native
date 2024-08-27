import { createContext, FC, PropsWithChildren, useCallback, useContext, useRef, useState } from "react";
import { Vibration } from "react-native";

import { apiBase, conId } from "../../configuration";
import { useAppDispatch, useAppStore } from "../../store";
import { applySync, eurofurenceCacheVersion, resetCache } from "../../store/eurofurence/slice";

type SynchronizationProviderProps = {
    /**
     * True if synchronizing.
     */
    isSynchronizing: boolean;

    /**
     * Call this function to trigger a synchronization step.
     */
    synchronize: (vibrate?: boolean) => Promise<void>;

    /**
     * Clear the entire cache and start over again.
     */
    clear: () => Promise<void>;
};

const SynchronizationContext = createContext<SynchronizationProviderProps>({
    isSynchronizing: false,
    synchronize: () => Promise.resolve(),
    clear: () => Promise.resolve(),
});

export const SynchronizationProvider: FC<PropsWithChildren> = ({ children }) => {
    // Abort controller as well as current invocation marker.
    const invocation = useRef<AbortController | null>(null);

    // App dispatch and store, sends reset and sync invocations.
    const dispatch = useAppDispatch();
    const store = useAppStore();

    // Status, true if currently fetching or applying.
    const [isSynchronizing, setIsSynchronizing] = useState(false);

    // Sync method.
    const synchronize = useCallback(
        async (vibrate: boolean = true) => {
            // Vibrate if requested.
            if (vibrate) Vibration.vibrate(150);

            // Create controller, also used as a reference to check if the current invocation is still the one responsible.
            const ownInvocation = new AbortController();

            // Cancel old invocation.
            invocation.current?.abort();
            invocation.current = ownInvocation;

            // Mark start.
            setIsSynchronizing(true);

            // Retrieve internal values for current request.
            const { cid, cacheVersion, lastSynchronised } = store.getState().eurofurenceCache;

            // Sync fully if state is for a different convention.
            const path = cid === conId && cacheVersion === eurofurenceCacheVersion && lastSynchronised ? `Sync?since=${lastSynchronised}` : `Sync`;

            try {
                // Fetch and apply.
                const response = await fetch(`${apiBase}/${path}`, { signal: invocation.current.signal });
                const data = await response.json();

                // If this one is still the authority, apply this sync.
                if (invocation.current === ownInvocation) dispatch(applySync(data));
            } finally {
                // If this one is still the authority, unset synchronizing.
                if (invocation.current === ownInvocation) setIsSynchronizing(false);
            }
        },
        [invocation, dispatch],
    );

    // Dependent function.
    const clear = useCallback(() => {
        Vibration.vibrate(400);
        dispatch(resetCache());
        return synchronize(false);
    }, [dispatch, synchronize]);

    return (
        <SynchronizationContext.Provider
            value={{
                isSynchronizing,
                synchronize,
                clear,
            }}
        >
            {children}
        </SynchronizationContext.Provider>
    );
};

export const useSynchronizer = () => useContext(SynchronizationContext);
