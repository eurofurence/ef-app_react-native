import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "../index";
import { RecordId } from "../eurofurence/types";
import { Notification } from "./slice";

export const selectEventReminders = createSelector([(state: RootState) => state.background.notifications], (notifications): Notification[] => {
    return notifications.filter((item) => item.type === "EventReminder");
});

export const selectEventReminderById = createSelector(
    [(state: RootState) => state.background.notifications, (_state, id: RecordId) => id],
    (notifications, id): Notification | null => {
        return notifications.find((notification) => notification.recordId === id) ?? null;
    },
);
