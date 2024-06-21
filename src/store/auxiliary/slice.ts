import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RecordId } from "../eurofurence/types";

type AuxiliaryState = {
    lastViewTimes?: Record<RecordId, string>;
    hiddenEvents?: RecordId[];
    favoriteDealers?: RecordId[];
};
const initialState: AuxiliaryState = {
    lastViewTimes: {},
    hiddenEvents: [],
    favoriteDealers: [],
};

export const auxiliary = createSlice({
    name: "auxiliary",
    initialState,
    reducers: {
        setViewed(state, action: PayloadAction<{ id: RecordId; now: string }>) {
            state.lastViewTimes ??= {};
            state.lastViewTimes[action.payload.id] = action.payload.now;
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
    },
});

export const { setViewed, hideEvent, unhideEvent, toggleEventHidden, unhideAllEvents, favoriteDealer, unfavoriteDealer, toggleDealerFavorite } = auxiliary.actions;
