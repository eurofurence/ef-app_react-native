import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RecordId } from "./eurofurence.types";

type AuxiliaryState = {
    lastViewTimes: Record<RecordId, string>;
};
const initialState: AuxiliaryState = {
    lastViewTimes: {},
};

export const auxiliary = createSlice({
    name: "auxiliary",
    initialState,
    reducers: {
        setViewed: (state, action: PayloadAction<{ id: RecordId; now: string }>) => {
            state.lastViewTimes[action.payload.id] = action.payload.now;
        },
    },
});

export const { setViewed } = auxiliary.actions;
