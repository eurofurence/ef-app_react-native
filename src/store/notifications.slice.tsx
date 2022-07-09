import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RecordId } from "./eurofurence.types";

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
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.notifications.push(action.payload);
        },
        removeNotification: (state, action: PayloadAction<RecordId>) => {
            state.notifications = state.notifications.filter((it) => it.recordId !== action.payload);
        },
    },
});

export const { addNotification, removeNotification } = notificationsSlice.actions;
