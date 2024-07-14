import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RecordId } from "../eurofurence/types";

type AuxiliaryState = {
    lastViewTimes?: Record<RecordId, string>;
    hiddenEvents?: RecordId[];
    favoriteDealers?: RecordId[];
    deviceWarningsHidden?: boolean;
};
const initialState: AuxiliaryState = {
    lastViewTimes: {},
    hiddenEvents: [],
    favoriteDealers: [],
    deviceWarningsHidden: false,
};

export const auxiliary = createSlice({
    name: "auxiliary",
    initialState,
    reducers: {
        setViewed(state, action: PayloadAction<{ id: RecordId | RecordId[]; now: string }>) {
            state.lastViewTimes ??= {};
            if (Array.isArray(action.payload.id)) {
                for (const id in action.payload.id) {
                    state.lastViewTimes[id] = action.payload.now;
                }
            } else {
                state.lastViewTimes[action.payload.id] = action.payload.now;
            }
        },
        hideEvent(state, action: PayloadAction<RecordId>) {
            state.hiddenEvents ??= [];
            state.hiddenEvents.push(action.payload);
        },
        unhideEvent(state, action: PayloadAction<RecordId>) {
            state.hiddenEvents ??= [];
            const index = state.hiddenEvents.indexOf(action.payload);
            if (index >= 0) state.hiddenEvents.splice(index, 1);
        },
        toggleEventHidden(state, action: PayloadAction<RecordId>) {
            state.hiddenEvents ??= [];
            const index = state.hiddenEvents.indexOf(action.payload);
            if (index >= 0) state.hiddenEvents.splice(index, 1);
            else state.hiddenEvents.push(action.payload);
        },
        unhideAllEvents(state) {
            state.hiddenEvents ??= [];
            state.hiddenEvents.splice(0, state.hiddenEvents.length);
        },

        favoriteDealer(state, action: PayloadAction<RecordId>) {
            state.favoriteDealers ??= [];
            state.favoriteDealers.push(action.payload);
        },
        unfavoriteDealer(state, action: PayloadAction<RecordId>) {
            state.favoriteDealers ??= [];
            const index = state.favoriteDealers.indexOf(action.payload);
            if (index >= 0) state.favoriteDealers.splice(index, 1);
        },
        toggleDealerFavorite(state, action: PayloadAction<RecordId>) {
            state.favoriteDealers ??= [];
            const index = state.favoriteDealers.indexOf(action.payload);
            if (index >= 0) state.favoriteDealers.splice(index, 1);
            else state.favoriteDealers.push(action.payload);
        },
        hideDeviceWarnings(state) {
            state.deviceWarningsHidden = false;
        },
        showDeviceWarnings(state) {
            state.deviceWarningsHidden = true;
        },
        toggleShowDeviceWarnings(state) {
            state.deviceWarningsHidden = !state.deviceWarningsHidden;
        },
    },
});

export const {
    setViewed,
    hideEvent,
    unhideEvent,
    toggleEventHidden,
    unhideAllEvents,
    favoriteDealer,
    unfavoriteDealer,
    toggleDealerFavorite,
    hideDeviceWarnings,
    showDeviceWarnings,
    toggleShowDeviceWarnings,
} = auxiliary.actions;
