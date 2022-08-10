import {
    addNotificationReceivedListener,
    addNotificationResponseReceivedListener,
    deleteNotificationChannelAsync,
    Notification,
    NotificationResponse,
    removeNotificationSubscription,
    setNotificationChannelAsync,
} from "expo-notifications";
import { NotificationChannelInput } from "expo-notifications/src/NotificationChannelManager.types";
import { useEffect } from "react";

export const useNotificationChannel = (channel: NotificationChannelInput & { name: string }) => {
    useEffect(() => {
        let created = false;

        // Try to create the channel. Set created if successful, otherwise log error.
        setNotificationChannelAsync(channel.name, channel).then(
            () => (created = true),
            (e) => console.error("Could not set up notification channel", e)
        );
        return () => {
            // If created, delete the channel.
            if (created) {
                deleteNotificationChannelAsync(channel.name).then(
                    () => (created = false),
                    (e) => console.error("Could not delete notification channel", e)
                );
            }
        };
    }, [channel]);
};

export const useNotificationListener = (listener: (event: Notification) => void) => {
    useEffect(() => {
        // Add handle subscription.
        const subscription = addNotificationReceivedListener(listener);

        return () => {
            // Remove subscription.
            removeNotificationSubscription(subscription);
        };
    }, [listener]);
};

export const useNotificationInteraction = (listener: (response: NotificationResponse) => void) => {
    useEffect(() => {
        // Add handle subscription.
        const subscription = addNotificationResponseReceivedListener(listener);

        return () => {
            // Remove subscription.
            removeNotificationSubscription(subscription);
        };
    }, [listener]);
};
