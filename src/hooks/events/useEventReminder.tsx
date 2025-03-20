import { useCallback } from "react";
import { captureException } from "@sentry/react-native";
import { EventRecord } from "@/store/eurofurence/types";
import { useDataCache } from "@/context/DataCacheProvider";
import { scheduleEventReminder, cancelEventReminder } from "@/utils/eventReminders";

export const useEventReminder = (event: EventRecord) => {
    const { getCacheSync, saveCache, removeCache } = useDataCache();
    // Retrieve timeTravel value from cache, default to 0
    const timeTravel = getCacheSync<number>("timetravel", "amount")?.data ?? 0;
    // Retrieve the reminder from cache
    const reminder = getCacheSync<any>("notifications", event.Id);

    const createReminder = useCallback(() => {
        return scheduleEventReminder(event, timeTravel, saveCache);
    }, [saveCache, timeTravel, event]);

    const removeReminder = useCallback(() => {
        return cancelEventReminder(event.Id, removeCache);
    }, [removeCache, event.Id]);

    const toggleReminder = useCallback(() => {
        if (reminder) {
            return cancelEventReminder(event, removeCache);
        } else {
            return scheduleEventReminder(event, timeTravel, saveCache);
        }
    }, [removeCache, saveCache, timeTravel, reminder, event]);

    return {
        isFavorite: Boolean(reminder),
        createReminder,
        removeReminder,
        toggleReminder,
    };
}; 