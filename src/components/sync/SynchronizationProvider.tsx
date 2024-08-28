import { createContext, FC, PropsWithChildren, useCallback, useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Vibration } from "react-native";

import { apiBase, conId } from "../../configuration";
import { useToast } from "../../context/ToastContext";
import { useAppDispatch, useAppStore } from "../../store";
import { applySync, eurofurenceCacheVersion, resetCache } from "../../store/eurofurence/slice";

export type SynchronizationProviderProps = {
    /**
     * True if synchronizing.
     */
    isSynchronizing: boolean;

    /**
     * Call this function to trigger a synchronization step.
     */
    synchronize: () => Promise<void>;

    /**
     * Call this function to trigger a synchronization step. Notifies via toasts.
     * @param vibrate True if vibration wanted.
     */
    synchronizeUi: (vibrate?: boolean) => Promise<void>;

    /**
     * Clear the entire cache and start over again.
     */
    clear: () => Promise<void>;
};

export const SynchronizationContext = createContext<SynchronizationProviderProps>({
    isSynchronizing: false,
    synchronize: () => Promise.resolve(),
    synchronizeUi: () => Promise.resolve(),
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

    // Translation and toast method for toast.
    const { t } = useTranslation("Home");
    const toast = useToast();

    // Sync method.
    const synchronize = useCallback(async () => {
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
    }, [invocation, dispatch]);

    // Dependent function.
    const clear = useCallback(() => {
        Vibration.vibrate(400);
        dispatch(resetCache());
        return synchronize();
    }, [dispatch, synchronize]);

    // Dependent function.
    const synchronizeUi = useCallback(
        async (vibrate: boolean = true) => {
            if (vibrate) Vibration.vibrate(400);
            try {
                return await synchronize();
            } catch (error) {
                toast("warning", t("sync_error"));
                throw error;
            }
        },
        [t, toast, synchronize],
    );

    return (
        <SynchronizationContext.Provider
            value={{
                isSynchronizing,
                synchronize,
                synchronizeUi,
                clear,
            }}
        >
            {children}
        </SynchronizationContext.Provider>
    );
};

export const useSynchronizer = () => useContext(SynchronizationContext);
