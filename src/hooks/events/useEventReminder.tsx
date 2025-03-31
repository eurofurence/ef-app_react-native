import { useCallback } from "react";
import { EventRecord } from "@/store/eurofurence/types";
import { useDataCache } from "@/context/DataCacheProvider";
import { scheduleEventReminder, cancelEventReminder } from "@/util/eventReminders";

export const useEventReminder = (event: EventRecord) => {
    const { getCacheSync, saveCache, removeCache } = useDataCache();

    // Retrieve timeTravel value from cache, default to 0
    const timeTravel = getCacheSync("timetravel", "timeOffset")?.data ?? 0;
    // Retrieve the reminder from cache
    const reminder = getCacheSync("notifications", event.Id);

    // Create wrapper functions that match the expected types
    const saveCacheWrapper = (storeName: string, key: string, data: any) => {
        saveCache(storeName as any, key, data);
    };

    const removeCacheWrapper = (storeName: string, key: string) => {
        removeCache(storeName as any, key);
    };

    const createReminder = useCallback(() => {
        return scheduleEventReminder(event, timeTravel, saveCacheWrapper);
    }, [saveCacheWrapper, timeTravel, event]);

    const removeReminder = useCallback(() => {
        return cancelEventReminder(event.Id, removeCacheWrapper);
    }, [removeCacheWrapper, event.Id]);

    const toggleReminder = useCallback(() => {
        if (reminder) {
            return cancelEventReminder(event, removeCacheWrapper);
        } else {
            return scheduleEventReminder(event, timeTravel, saveCacheWrapper);
        }
    }, [removeCacheWrapper, saveCacheWrapper, timeTravel, reminder, event]);

    return {
        isFavorite: Boolean(reminder),
        createReminder,
        removeReminder,
        toggleReminder,
    };
};
