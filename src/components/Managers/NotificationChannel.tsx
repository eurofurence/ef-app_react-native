import { setNotificationChannelAsync } from "expo-notifications";
import * as Notifications from "expo-notifications";

// Import globally at index, this code runs the method on import.

// Setup default channel.
setNotificationChannelAsync("default", {
    name: "default",
    importance: Notifications.AndroidImportance.MIN,
    lightColor: "#006459",
}).then(
    () => console.log("Assigned notification channel"),
    (e) => console.error("Failed to assign notification channel:", e)
);
