import * as Notifications from "expo-notifications";
import moment from "moment";
import { useCallback, useMemo } from "react";
import { Platform } from "react-native";

import { conId } from "../../configuration";
import { useAppDispatch, useAppSelector } from "../../store";
import { addNotification, Notification, removeNotification } from "../../store/background/slice";
import { EventRecord } from "../../store/eurofurence/types";

export const useEventReminder = (event: EventRecord) => {
    const dispatch = useAppDispatch();
    const timeTravel = useAppSelector((state) => state.timetravel.amount);
    const notificationEntry = useAppSelector((state) => state.background.notifications.find((it) => it.recordId === event.Id));

    const createReminder = useCallback(() => {
        const scheduleDate = moment(event.StartDateTimeUtc).subtract(timeTravel, "milliseconds").subtract(30, "minutes");
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
                    data: {
                        CID: conId,
                        Event: "Event",
                        RelatedId: event.Id,
                    },
                },
                trigger: {
                    date: scheduleDate.toDate(),
                    channelId: "event_reminders",
                },
            }).catch(console.error);
        }

        dispatch(addNotification(notification));
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
