import { useEffect, useMemo, useRef, useState } from "react";
import { useDataCache } from "@/context/DataCacheProvider";
import { DealerDetails, EventDetails } from "@/store/eurofurence/types";

export function useFavoritesState() {
    const { getAllCache, getCache, saveCache } = useDataCache();
    const [favoriteEvents, setFavoriteEvents] = useState<EventDetails[]>([]);
    const [favoriteDealers, setFavoriteDealers] = useState<DealerDetails[]>([]);
    const [lastViewTimes, setLastViewTimes] = useState<Record<string, string>>({});
    const cacheRef = useRef({ getAllCache, getCache, saveCache });

    // Update ref if cache functions change
    useEffect(() => {
        cacheRef.current = { getAllCache, getCache, saveCache };
    }, [getAllCache, getCache, saveCache]);

    useEffect(() => {
        let mounted = true;
        async function loadData() {
            const [eventCache, dealerCache, lastViewCache] = await Promise.all([
                cacheRef.current.getAllCache("events"),
                cacheRef.current.getAllCache("dealers"),
                cacheRef.current.getCache("settings", "lastViewTimes")
            ]);

            if (!mounted) return;

            const events = eventCache.map((item) => item.data).filter((event: EventDetails) => event.Favorite);
            const dealers = dealerCache.map((item) => item.data).filter((dealer: DealerDetails) => dealer.Favorite);
            
            setFavoriteEvents(events);
            setFavoriteDealers(dealers);
            const lastViewTimesData = lastViewCache?.data?.lastViewTimes || {};
            setLastViewTimes(lastViewTimesData);
            cacheRef.current.saveCache("settings", "settings", {
                cid: lastViewCache?.data?.cid || "",
                cacheVersion: lastViewCache?.data?.cacheVersion || "",
                lastSynchronised: lastViewCache?.data?.lastSynchronised || "",
                state: lastViewCache?.data?.state || {},
                lastViewTimes: lastViewTimesData
            });
        }
        loadData();
        return () => { mounted = false; };
    }, []); // No dependencies since we're using ref

    return useMemo(() => ({
        favoriteEvents,
        favoriteDealers,
        lastViewTimes
    }), [favoriteEvents, favoriteDealers, lastViewTimes]);
} 