import * as Notifications from "expo-notifications";
import moment from "moment";
import { useCallback, useMemo } from "react";
import { Platform } from "react-native";

import { useAppDispatch, useAppSelector } from "../../store";
import { addNotification, Notification, removeNotification } from "../../store/background.slice";
import { EventRecord } from "../../store/eurofurence.types";

export const useEventReminder = (event: EventRecord) => {
    const dispatch = useAppDispatch();
    const timetravel = useAppSelector((state) => state.timetravel.amount);
    const notificationEntry = useAppSelector((state) => state.background.notifications.find((it) => it.recordId === event.Id));

    const createReminder = useCallback(() => {
        const scheduleDate = moment(event.StartDateTimeUtc).subtract(timetravel, "milliseconds").subtract(30, "minutes");
        const notification: Notification = {
            recordId: event.Id,
            type: "EventReminder",
            dateCreated: moment().toISOString(),
            dateScheduled: scheduleDate.toISOString(),
        };

        if (Platform.OS === "android" || Platform.OS === "ios") {
            Notifications.scheduleNotificationAsync({
                identifier: notification.recordId,
                content: {
                    title: event.Title,
                    subtitle: "This event is starting soon!",
                },
                trigger: {
                    date: scheduleDate.toDate(),
                    channelId: "event_reminders",
                },
            });
        }

        dispatch(addNotification(notification));
    }, [event, timetravel]);

    const removeReminder = useCallback(() => {
        if (Platform.OS === "android" || Platform.OS === "ios") {
            Notifications.cancelScheduledNotificationAsync(event.Id);
        }
        dispatch(removeNotification(event.Id));
    }, [event]);

    const toggleReminder = useMemo(() => (notificationEntry ? removeReminder : createReminder), [notificationEntry, createReminder, removeReminder]);
    return {
        isFavorited: Boolean(notificationEntry),
        createReminder,
        removeReminder,
        toggleReminder,
    };
};
