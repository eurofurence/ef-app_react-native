import { scheduleNotificationAsync } from "expo-notifications";
import { Platform } from "react-native";

import { conId, conName } from "../../configuration";
import { i18t } from "../../i18n";
import { AppAnnouncement, AppNotification } from "./NotificationManager.types";

/**
 * Name of the background task handling notifications when not in foreground.
 */
export const BG_NOTIFICATIONS_NAME = "background_notifications";

/**
 * Name of the field in the async storage that marks a sync request from background.
 */
export const BG_SYNC_REQUEST = "background_sync_requested";

/**
 * List of topics for this device.
 */
export const TOPICS = [`${conId}-${Platform.OS}`, `${conId}-expo`, `${conId}`];

export const scheduleAnnouncement = async (data: AppAnnouncement) => {
    // Skip when empty.
    if (!data.title && !data.text) return;

    // Get translation.
    const t = await i18t;

    // Schedule the announcement.
    await scheduleNotificationAsync({
        identifier: `Announcement:${data.relatedId}`,
        content: {
            title: data.title,
            subtitle: t("Notification:announcement", { conName }),
            body: data.text,
        },
        trigger: null,
    });
};

export const scheduleNotification = async (data: AppNotification) => {
    // Skip when empty.
    if (!data.title && !data.message) return;

    // Get translation.
    const t = await i18t;

    // Schedule the notification.
    await scheduleNotificationAsync({
        identifier: `Notification:${data.relatedId}`,
        content: {
            title: data.title,
            subtitle: t("Notification:private_message", { conName }),
            body: data.message,
        },
        trigger: null,
    });
};
