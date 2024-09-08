import * as Notifications from "expo-notifications";
import moment from "moment-timezone";
import { useCallback, useMemo } from "react";
import { Platform } from "react-native";

import { captureException } from "@sentry/react-native";
import { conId } from "../../configuration";
import { useAppDispatch, useAppSelector } from "../../store";
import { addNotification, removeNotification } from "../../store/background/slice";
import { EventRecord } from "../../store/eurofurence/types";

export const useEventReminder = (event: EventRecord) => {
    const dispatch = useAppDispatch();
    const timeTravel = useAppSelector((state) => state.timetravel.amount);
    const notificationEntry = useAppSelector((state) => state.background.notifications.find((it) => it.recordId === event.Id));

    const createReminder = useCallback(() => {
        const dateCreatedUtc = moment.utc();
        const dateScheduleUtc = moment.utc(event.StartDateTimeUtc).subtract(timeTravel, "milliseconds").subtract(30, "minutes");

        // Platform schedule the notification.
        if (Platform.OS === "android" || Platform.OS === "ios") {
            Notifications.scheduleNotificationAsync({
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
            }).catch(captureException);
        }

        // Save to data.
        dispatch(
            addNotification({
                recordId: event.Id,
                type: "EventReminder",
                dateCreatedUtc: dateCreatedUtc.format(),
                dateScheduledUtc: dateScheduleUtc.format(),
            }),
        );
    }, [event, timeTravel, dispatch]);

    const removeReminder = useCallback(() => {
        if (Platform.OS === "android" || Platform.OS === "ios") {
            Notifications.cancelScheduledNotificationAsync(event.Id).catch(console.error);
        }
        dispatch(removeNotification(event.Id));
    }, [dispatch, event]);

    const toggleReminder = useMemo(() => (notificationEntry ? removeReminder : createReminder), [notificationEntry, createReminder, removeReminder]);
    return {
        isFavorite: Boolean(notificationEntry),
        createReminder,
        removeReminder,
        toggleReminder,
    };
};
