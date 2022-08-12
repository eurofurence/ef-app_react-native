import AsyncStorage from "@react-native-async-storage/async-storage";
import { registerTaskAsync, setNotificationHandler } from "expo-notifications";
import { defineTask, TaskManagerTaskBody } from "expo-task-manager";
import { match, P } from "ts-pattern";

import { BG_NOTIFICATIONS_NAME, BG_SYNC_REQUEST, scheduleAnnouncement, scheduleNotification } from "./NotificationManager.common";
import { isAnnouncement, isNotification, isPayload, isSync } from "./NotificationManager.types";

// Define task for notification handling.
defineTask(BG_NOTIFICATIONS_NAME, ({ data, error, executionInfo }: TaskManagerTaskBody<{ notification?: any }>) => {
    // Skip method if error was given to be handled.
    if (error) {
        console.error("An error occurred while processing notifications in background", error);
        return;
    }

    // Log that a notification was received.
    console.log("Received data in background", data, "App state", executionInfo.appState);

    // Resolve data to actual content.
    const content = data?.notification?.data?.body && JSON.parse(data?.notification?.data?.body);

    // Needs to be a notification type payload.
    if (!isPayload(content)) return;

    // Mark requested.
    if (isSync(content)) {
        return AsyncStorage.setItem(BG_SYNC_REQUEST, "true").then(
            () => console.log("Sync marked requested"),
            (e) => console.error("Could not mark sync as requested", e)
        );
    }

    // Handle all announcements.
    if (isAnnouncement(content)) {
        return scheduleAnnouncement(content).then(
            () => console.log("Announcement scheduled on background"),
            (e) => console.error("Unable to schedule announcement on background", e)
        );
    }

    // Handle all notifications.
    if (isNotification(content)) {
        return scheduleNotification(content).then(
            () => console.log("Notification scheduled on background"),
            (e) => console.error("Unable to schedule notification on background", e)
        );
    }
});

// Connect to notifications.
registerTaskAsync(BG_NOTIFICATIONS_NAME).then(
    () => console.log("Successfully connected for background notifications"),
    (e) => console.error("Unable to connect for background notifications", e)
);

// Set general notification handling strategies, needed both in background and
// in foreground.
setNotificationHandler({
    handleNotification: async (notification) =>
        match(notification.request.content)
            .with({ title: P.string }, () => ({
                // If there is a title, show the alert
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            }))
            .otherwise(() => ({
                // Base case, show nothing
                shouldShowAlert: false,
                shouldPlaySound: false,
                shouldSetBadge: false,
            })),
});
