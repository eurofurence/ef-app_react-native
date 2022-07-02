import * as Notifications from "expo-notifications";
import { useEffect } from "react";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

export const NotificationManager = () => {
    useEffect(() => {
        Notifications.getAllScheduledNotificationsAsync().then((notifications) => console.log(notifications));
    }, []);
    useEffect(() => {
        Notifications.scheduleNotificationAsync({
            content: {
                title: "Test",
                subtitle: "This is a test for local notifications",
            },
            identifier: "test-notification",
            trigger: {
                seconds: 5,
            },
        });
    }, []);

    return null;
};
