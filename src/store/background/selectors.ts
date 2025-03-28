import { RecordId } from "../eurofurence/types";
import { Notification } from "./slice";

// Plain functions to filter notifications without using Redux or RootState

export const selectEventReminders = (notifications: Notification[]): Notification[] => {
    return notifications.filter((item) => item.type === "EventReminder");
};

export const selectEventReminderById = (notifications: Notification[], id: RecordId): Notification | null => {
    return notifications.find((notification) => notification.recordId === id) ?? null;
};
