import { useEffect, useMemo } from "react";
import { defaultSettings, useDataCache } from "@/context/DataCacheProvider";
import { RecordMetadata } from "@/store/eurofurence/types";
import { useNow } from "@/hooks/time/useNow";
import { isAfter, parseISO } from "date-fns";

/**
 * Gets the last viewed time of this record and if the record has changed
 * since, returns true. Also connects setting the viewed time of the item after
 * a delay.
 * @param item The item or null or undefined if not yet loaded.
 * @param delay The delay before setting as viewed.
 */
export const useUpdateSinceNote = (item: RecordMetadata | null | undefined, delay = 3_000) => {
    const now = useNow();
    const { getCacheSync, saveCache } = useDataCache();
    const settings = useMemo(() => getCacheSync("settings", "settings")?.data ?? defaultSettings, [getCacheSync]);
    const lastViewed = item ? settings.lastViewTimes[item.Id] : null;

    const updated = useMemo(() =>
            Boolean(item && lastViewed && isAfter(parseISO(item.LastChangeDateTimeUtc), parseISO(lastViewed))),
        [item, lastViewed]
    );

    useEffect(() => {
        if (!item) return;

        const handle = setTimeout(() => {
            const newSettings = {
                ...settings,
                lastViewTimes: {
                    ...settings.lastViewTimes,
                    [item.Id]: now.toISOString()
                }
            };
            saveCache("settings", "settings", newSettings);
        }, delay);
        return () => {
            clearTimeout(handle);
        };
    }, [item, delay, now, settings, saveCache]);

    return updated;
};
