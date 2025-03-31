import { useEffect, useMemo, useRef, useState } from "react";
import { defaultSettings, useDataCache } from "@/context/DataCacheProvider";
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
            const [eventCache, dealerCache, settings] = await Promise.all([
                cacheRef.current.getAllCache("events"),
                cacheRef.current.getAllCache("dealers"),
                cacheRef.current.getCache("settings", "settings").then(result => result?.data ?? defaultSettings)
            ]);

            if (!mounted) return;

            const events = eventCache.map((item) => item.data).filter((event: EventDetails) => event.Favorite);
            const dealers = dealerCache.map((item) => item.data).filter((dealer: DealerDetails) => dealer.Favorite);

            setFavoriteEvents(events);
            setFavoriteDealers(dealers);
            const lastViewTimesData = settings?.lastViewTimes || {};
            setLastViewTimes(lastViewTimesData);

            cacheRef.current.saveCache("settings", "settings", { ...settings, lastViewTimes: lastViewTimesData });
        }

        loadData();
        return () => {
            mounted = false;
        };
    }, []); // No dependencies since we're using ref

    return useMemo(() => ({
        favoriteEvents,
        favoriteDealers,
        lastViewTimes
    }), [favoriteEvents, favoriteDealers, lastViewTimes]);
}
