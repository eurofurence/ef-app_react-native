import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TimeTravelState {
    timeTravelAmount: number;
    timeTravelEnabled: boolean;
    timeTravelVisible: boolean;
}

const initialState: TimeTravelState = {
    timeTravelAmount: 0,
    timeTravelEnabled: false,
    timeTravelVisible: false,
};

export const timeTravelSlice = createSlice({
    name: "timetravel",
    initialState,
    reducers: {
        travelForward: (state, action: PayloadAction<number>) => {
            state.timeTravelAmount += action.payload;
        },
        travelBackward: (state, action: PayloadAction<number>) => {
            state.timeTravelAmount -= action.payload;
        },
        resetTravel: (state) => {
            state.timeTravelAmount = 0;
        },
        enableTimeTravel: (state, action: PayloadAction<boolean>) => {
            state.timeTravelEnabled = action.payload;
        },
        showTimeTravel: (state, action: PayloadAction<boolean>) => {
            state.timeTravelVisible = action.payload;
        },
    },
});

export const { travelForward, travelBackward, resetTravel, enableTimeTravel, showTimeTravel } = timeTravelSlice.actions;
