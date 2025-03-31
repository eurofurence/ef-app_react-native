import { useMemo } from "react";
import { sortBy } from "lodash";
import { isSameDay } from "date-fns";
import { Redirect } from "expo-router";
import { useNow } from "@/hooks/time/useNow";
import { useDataCache } from "@/context/DataCacheProvider";
import { eventsRoutePrefix } from "@/app/(areas)/schedule/+not-found";

export default function RedirectIndex() {
    const now = useNow("static");
    const { getAllCacheSync } = useDataCache();
    const days = useMemo(() => sortBy(getAllCacheSync("eventDays"), "data.Date"), [getAllCacheSync]);

    // Not actionable yet. Return null.
    if (!days.length) return null;

    // Find matching date or use first.
    const target = days.find(item => isSameDay(now, item.data.Date)) ?? days[0];
    return <Redirect href={eventsRoutePrefix + target.data.Id} />;
}
