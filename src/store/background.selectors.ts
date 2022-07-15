import { createSelector } from "@reduxjs/toolkit";
import _ from "lodash";

import { Notification } from "./background.slice";

export const selectEventReminders = createSelector(
    (state: any): Notification[] => state.notifications.notifications,
    (notifications) =>
        _.chain(notifications)
            .filter((it) => it.type === "EventReminder")
            .orderBy((it) => it.dateScheduled, "desc")
            .value()
);
