import * as Notifications from "expo-notifications";
import moment from "moment";
import { useCallback, useMemo } from "react";
import { Platform } from "react-native";

import { useAppDispatch, useAppSelector } from "../store";
import { EventRecord } from "../store/eurofurence.types";
import { addNotification, Notification, removeNotification } from "../store/notifications.slice";

export const useEventReminder = (event: EventRecord) => {
    const dispatch = useAppDispatch();
    const timetravel = useAppSelector((state) => state.timetravel.amount);
    const notificationEntry = useAppSelector((state) => state.notifications.notifications.find((it) => it.recordId === event.Id));

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
                trigger: scheduleDate.toDate(),
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
