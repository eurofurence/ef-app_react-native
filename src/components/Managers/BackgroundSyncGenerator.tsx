import { registerTaskAsync } from "expo-notifications";
import { defineTask, TaskManagerTaskBody } from "expo-task-manager";
import { Platform } from "react-native";

import { requestSyncFromBackground } from "./BackgroundSyncManager";
import { conId } from "../../configuration";
import { captureEvent, captureNotificationException } from "../../sentryHelpers";

// Import globally at index, this code runs the method on import.

/**
 * Name of the background task handling notifications when not in foreground.
 */
const BG_NOTIFICATIONS_NAME = "background_notifications";

// Define task for notification handling.
defineTask(BG_NOTIFICATIONS_NAME, ({ data, error, executionInfo }: TaskManagerTaskBody<{ notification?: any }>) => {
    // Skip method if error was given to be handled.
    if (error) {
        captureEvent(error);
        return;
    }

    // Log that a notification was received.
    console.log("Received data in background", data, "App state", executionInfo.appState);

    // Get event data.
    const cid = data?.notification?.data?.CID;
    const event = data?.notification?.data?.Event;

    // Skip if not for this convention.
    if (cid !== conId) return;

    // Handle for Sync events only.
    if (event === "Sync") {
        // Is sync, request synchronization.
        requestSyncFromBackground().then(
            () => console.log("Sync marked requested"),
            (e) => captureNotificationException("Could not mark sync as requested", e),
        );
    }
});

// Connect to notification on supported platforms.
if (Platform.OS === "android" || Platform.OS === "ios")
    registerTaskAsync(BG_NOTIFICATIONS_NAME).then(
        () => console.log("Successfully connected for background notifications"),
        (e) => captureNotificationException("Unable to connect for background notifications", e),
    );
else console.log("Skipping registration of sync generator, unsupported on web.");
