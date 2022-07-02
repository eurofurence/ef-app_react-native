import { createSelector } from "@reduxjs/toolkit";

import { Notification } from "./notifications.slice";

export const selectEventReminders = createSelector(
    (state): Notification[] => state.notifications.notifications,
    (notifications) => notifications.filter((it) => it.type === "EventReminder")
);
