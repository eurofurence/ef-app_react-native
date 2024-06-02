import { setNotificationHandler } from "expo-notifications";

import { captureNotificationException } from "../sentryHelpers";

// Import globally at index, this code runs the method on import.

// Set general notification handling strategy.
setNotificationHandler({
    handleNotification: ({ request: { content } }) => {
        // Mark handling notification.
        console.log("Handling notification", content);

        // Show if it's a notification trigger.
        return Promise.resolve({
            shouldShowAlert: typeof content?.title === "string" || typeof content?.body === "string",
            shouldPlaySound: false,
            shouldSetBadge: false,
        });
    },
    handleSuccess: (id) => {
        // Log success.
        console.log(`Handled notification successfully, assigned ID: ${id}`);
    },
    handleError: (id, error) => {
        // Log error.
        captureNotificationException(`Handling notification failed, assigned ID: ${id}`, error);
    },
});
