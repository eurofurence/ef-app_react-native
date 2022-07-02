import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as Notifications from "expo-notifications";
import moment, { Moment } from "moment";

import { EventRecord, RecordId } from "./eurofurence.types";

export type Notification = {
    recordId: RecordId;
    type: "EventReminder";
    dateScheduled: string;
    dateCreated: string;
};
type NotificationState = {
    notifications: Notification[];
};

const initialState: NotificationState = {
    notifications: [],
};

export const notificationsSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        createEventReminder: {
            reducer: (state, action: PayloadAction<Notification>) => {
                state.notifications.push(action.payload);
            },
            prepare: (scheduleTime: Moment, event: EventRecord) => {
                const notification: Notification = {
                    recordId: event.Id,
                    type: "EventReminder",
                    dateCreated: moment().toISOString(),
                    dateScheduled: scheduleTime.toISOString(),
                };

                Notifications.scheduleNotificationAsync({
                    identifier: notification.recordId,
                    content: {
                        title: "An event is starting soon!",
                        subtitle: event.Title,
                    },
                    trigger: scheduleTime.toDate(),
                });

                return { payload: notification };
            },
        },
    },
});

export const { createEventReminder } = notificationsSlice.actions;
