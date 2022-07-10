import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RecordId } from "./eurofurence.types";

export type Notification = {
    recordId: RecordId;
    type: "EventReminder";
    dateScheduled: string;
    dateCreated: string;
};

export type FCMMessage = {
    dateReceived: string;
    content: object;
    identifier: string;
};
type NotificationState = {
    notifications: Notification[];
    fcmMessages: FCMMessage[];
};

const initialState: NotificationState = {
    notifications: [],
    fcmMessages: [],
};

export const backgroundSlice = createSlice({
    name: "background",
    initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<Notification>) => {
            state.notifications.push(action.payload);
        },
        removeNotification: (state, action: PayloadAction<RecordId>) => {
            state.notifications = state.notifications.filter((it) => it.recordId !== action.payload);
        },
        logFCMMessage: (state, action: PayloadAction<FCMMessage>) => {
            state.fcmMessages.push(action.payload);
        },
    },
});

export const { addNotification, removeNotification, logFCMMessage } = backgroundSlice.actions;
