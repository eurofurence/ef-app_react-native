import { useCallback, useEffect, useRef, useState } from "react";
import { useDataCache } from "@/context/DataCacheProvider";

export function useWarningState(warningKey: string) {
    const { getCache, saveCache } = useDataCache();
    const [isHidden, setIsHidden] = useState(false);
    const cacheRef = useRef({ getCache, saveCache });

    // Update ref if cache functions change
    useEffect(() => {
        cacheRef.current = { getCache, saveCache };
    }, [getCache, saveCache]);

    useEffect(() => {
        let mounted = true;
        const loadWarningState = async () => {
            const cache = await cacheRef.current.getCache<boolean>("settings", warningKey);
            if (mounted) {
                setIsHidden(cache?.data ?? false);
            }
        };
        loadWarningState();
        return () => { mounted = false; };
    }, [warningKey]);

    const hideWarning = useCallback(async () => {
        await cacheRef.current.saveCache("settings", warningKey, true);
        setIsHidden(true);
    }, [warningKey]);

    return {
        isHidden,
        hideWarning
    };
} 