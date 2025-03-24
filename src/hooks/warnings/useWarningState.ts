import { useCallback, useEffect, useRef, useState } from "react";
import { useDataCache } from "@/context/DataCacheProvider";

type WarningKey = "deviceWarningsHidden" | "languageWarningsHidden" | "timeZoneWarningsHidden";

export function useWarningState(warningKey: WarningKey) {
    const { getCache, saveCache } = useDataCache();
    const [isHidden, setIsHidden] = useState<boolean | null>(null);
    const cacheRef = useRef({ getCache, saveCache });

    // Update ref if cache functions change
    useEffect(() => {
        cacheRef.current = { getCache, saveCache };
    }, [getCache, saveCache]);

    useEffect(() => {
        let mounted = true;
        const loadWarningState = async () => {
            const cache = await cacheRef.current.getCache("warnings", "states");
            const warningStates = cache?.data ?? {};
            if (mounted) {
                setIsHidden(!!warningStates[warningKey]);
            }
        };
        loadWarningState();
        return () => { mounted = false; };
    }, [warningKey]);

    const hideWarning = useCallback(async () => {
        const cache = await cacheRef.current.getCache("warnings", "states");
        const warningStates = cache?.data ?? {};
        cacheRef.current.saveCache("warnings", "states", {
            ...warningStates,
            [warningKey]: true
        });
        setIsHidden(true);
    }, [warningKey]);

    const showWarning = useCallback(async () => {
        const cache = await cacheRef.current.getCache("warnings", "states");
        const warningStates = cache?.data ?? {};
        cacheRef.current.saveCache("warnings", "states", {
            ...warningStates,
            [warningKey]: false
        });
        setIsHidden(false);
    }, [warningKey]);

    return {
        isHidden,
        hideWarning,
        showWarning
    };
} 