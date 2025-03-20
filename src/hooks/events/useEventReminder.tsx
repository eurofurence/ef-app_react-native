import * as Notifications from "expo-notifications";
import { useCallback } from "react";
import { Platform } from "react-native";
import { captureException } from "@sentry/react-native";
import { format, isBefore, subMilliseconds, subMinutes } from "date-fns";

import { conId } from "@/configuration";
import { Auxiliary, EventRecord, RecordId } from "@/store/eurofurence/types";
import { useDataCache } from "@/context/DataCacheProvider";

export async function scheduleEventReminder(event: EventRecord, timeTravel: number, saveCache: ReturnType<typeof useDataCache>["saveCache"]) {
    // Get relevant UTC times.
    const dateCreatedUtc = new Date();
    const dateScheduleUtc = subMinutes(subMilliseconds(new Date(event.StartDateTimeUtc), timeTravel), 30);

    // If platform is on device, schedule actual notification.
    if ((Platform.OS === "android" || Platform.OS === "ios") && isBefore(dateCreatedUtc, dateScheduleUtc)) {
        await Notifications.scheduleNotificationAsync({
            identifier: event.Id,
            content: {
                title: event.Title,
                subtitle: "This event is starting soon!",
                data: {
                    CID: conId,
                    Event: "Event",
                    RelatedId: event.Id,
                },
            },
            trigger: {
                date: dateScheduleUtc,
                channelId: "event_reminders",
            },
        });
    }

    // Save notification to cache.
    saveCache("notifications", event.Id, {
        recordId: event.Id,
        type: "EventReminder",
        dateCreatedUtc: format(dateCreatedUtc, "yyyy-MM-dd'T'HH:mm:ssXXX"),
        dateScheduledUtc: format(dateScheduleUtc, "yyyy-MM-dd'T'HH:mm:ssXXX"),
    });
}

export async function cancelEventReminder(event: EventRecord | RecordId, removeCache: ReturnType<typeof useDataCache>["removeCache"]) {
    // Get actual identifier, might be called without an instance.
    const identifier = typeof event === "string" ? event : event.Id;

    // If platform is on device, cancel actual notification.
    if (Platform.OS === "android" || Platform.OS === "ios") {
        await Notifications.cancelScheduledNotificationAsync(identifier).catch((error) => captureException(error, { level: "warning" }));
    }

    // Remove notification from cache.
    removeCache("notifications", identifier);
}

export async function rescheduleEventReminder(
    event: EventRecord,
    timeTravel: number,
    saveCache: ReturnType<typeof useDataCache>["saveCache"],
    removeCache: ReturnType<typeof useDataCache>["removeCache"],
) {
    await cancelEventReminder(event, removeCache);
    await scheduleEventReminder(event, timeTravel, saveCache);
}

export const useEventReminder = (event: EventRecord) => {
    // Using DataCacheProvider
    const { getCacheSync, saveCache, removeCache } = useDataCache();
    // Retrieve timeTravel value from cache, default to 0
    const timeTravel = getCacheSync<Auxiliary>("auxiliary", "timetravel")?.data?.timetravel?.amount ?? 0;
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
