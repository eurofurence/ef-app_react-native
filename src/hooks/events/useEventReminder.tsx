import * as Notifications from "expo-notifications";
import moment from "moment-timezone";
import { useCallback } from "react";
import { Platform } from "react-native";

import { captureException } from "@sentry/react-native";
import { conId } from "../../configuration";
import { AppDispatch, useAppDispatch, useAppSelector } from "../../store";
import { addNotification, removeNotification } from "../../store/background/slice";
import { EventRecord, RecordId } from "../../store/eurofurence/types";
import { selectEventReminderById } from "../../store/background/selectors";

export async function scheduleEventReminder(dispatch: AppDispatch, event: EventRecord, timeTravel?: number) {
    // Get relevant UTC times.
    const dateCreatedUtc = moment.utc();
    const dateScheduleUtc = moment.utc(event.StartDateTimeUtc).subtract(timeTravel, "milliseconds").subtract(30, "minutes");

    // If platform is on device, schedule actual notification.
    if (Platform.OS === "android" || Platform.OS === "ios") {
        if (dateCreatedUtc.isBefore(dateScheduleUtc)) {
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
                    date: dateScheduleUtc.toDate(),
                    channelId: "event_reminders",
                },
            });
        }
    }

    // Dispatch writing notification. On device, this is preempted if the
    // previous invocation failed.
    dispatch(
        addNotification({
            recordId: event.Id,
            type: "EventReminder",
            dateCreatedUtc: dateCreatedUtc.format(),
            dateScheduledUtc: dateScheduleUtc.format(),
        }),
    );
}

export async function cancelEventReminder(dispatch: AppDispatch, event: EventRecord | RecordId) {
    // Get actual identifier, might be called without an instance.
    const identifier = typeof event === "string" ? event : event.Id;

    // If platform is on device, cancel actual notification.
    if (Platform.OS === "android" || Platform.OS === "ios") {
        await Notifications.cancelScheduledNotificationAsync(identifier).catch((error) =>
            captureException(error, {
                level: "warning",
            }),
        );
    }

    // Dispatch deleting notification.
    dispatch(removeNotification(identifier));
}

export async function rescheduleEventReminder(dispatch: AppDispatch, event: EventRecord, timeTravel?: number) {
    await cancelEventReminder(dispatch, event);
    await scheduleEventReminder(dispatch, event, timeTravel);
}

export const useEventReminder = (event: EventRecord) => {
    const dispatch = useAppDispatch();
    const timeTravel = useAppSelector((state) => state.timetravel.amount);
    const reminder = useAppSelector((state) => selectEventReminderById(state, event.Id));

    const createReminder = useCallback(() => {
        return scheduleEventReminder(dispatch, event, timeTravel);
    }, [dispatch, timeTravel, event]);

    const removeReminder = useCallback(() => {
        return cancelEventReminder(dispatch, event.Id);
    }, [dispatch, event.Id]);

    const toggleReminder = useCallback(() => {
        if (reminder) {
            return cancelEventReminder(dispatch, event);
        } else {
            return scheduleEventReminder(dispatch, event, timeTravel);
        }
    }, [dispatch, timeTravel, reminder, event]);

    return {
        isFavorite: Boolean(reminder),
        createReminder,
        removeReminder,
        toggleReminder,
    };
};
