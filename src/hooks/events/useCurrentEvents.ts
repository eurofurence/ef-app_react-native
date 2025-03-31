import { useEffect, useMemo, useRef, useState } from "react";
import { chain } from "lodash";
import { useDataCache } from "@/context/DataCacheProvider";
import { EventDetails } from "@/store/eurofurence/types";
import { filterCurrentEvents } from "@/store/eurofurence/selectors/events";
import { eventInstanceForAny } from "@/components/events/EventCard";

export function useCurrentEvents(now: Date, zone: string) {
    const { getAllCache } = useDataCache();
    const [events, setEvents] = useState<EventDetails[]>([]);
    const cacheRef = useRef({ getAllCache });

    // Update ref if cache functions change
    useEffect(() => {
        cacheRef.current = { getAllCache };
    }, [getAllCache]);

    useEffect(() => {
        let mounted = true;
        async function loadData() {
            const eventCache = await cacheRef.current.getAllCache("events");
            if (!mounted) return;

            const allEvents = eventCache.map(item => item.data);
            setEvents(allEvents);
        }
        loadData();
        return () => { mounted = false; };
    }, []); // No dependencies since we're using ref

    const currentEvents = useMemo(() => 
        chain(filterCurrentEvents(events, now))
            .filter(item => !item.Hidden)
            .map(details => eventInstanceForAny(details, now, zone))
            .orderBy("progress", "asc")
            .value(),
    [events, now, zone]);

    return currentEvents;
} 