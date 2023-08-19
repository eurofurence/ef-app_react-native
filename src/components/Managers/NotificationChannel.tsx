import * as Notifications from "expo-notifications";
import { setNotificationChannelAsync } from "expo-notifications";

import { captureNotificationException } from "../../sentryHelpers";

// Import globally at index, this code runs the method on import.

export type NotificationChannels = "default" | "event_reminders" | "announcements" | "private_messages";
// Setup default channel.
setNotificationChannelAsync("default", {
    name: "Miscellaneous",
    importance: Notifications.AndroidImportance.MIN,
    lightColor: "#006459",
}).then(
    () => console.log("Assigned default notification channel"),
    (e) => captureNotificationException("Failed to assign notification channel:", e),
);

setNotificationChannelAsync("event_reminders", {
    name: "Event Reminders",
    importance: Notifications.AndroidImportance.HIGH,
    lightColor: "#006459",
}).then(
    () => console.log("Assigned Event Reminders notification channel"),
    (e) => captureNotificationException("Failed to assign notification channel:", e),
);

setNotificationChannelAsync("announcements", {
    name: "Announcements",
    importance: Notifications.AndroidImportance.DEFAULT,
    lightColor: "#006459",
}).then(
    () => console.log("Assigned Announcements notification channel"),
    (e) => captureNotificationException("Failed to assign notification channel:", e),
);

setNotificationChannelAsync("private_messages", {
    name: "Private Messages",
    importance: Notifications.AndroidImportance.DEFAULT,
    lightColor: "#006459",
}).then(
    () => console.log("Assigned Private Messages notification channel"),
    (e) => captureNotificationException("Failed to assign notification channel:", e),
);
