import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TimeTravelState {
    amount: number;
    enabled: boolean;
    visible: boolean;
}

const initialState: TimeTravelState = {
    amount: 0,
    enabled: false,
    visible: false,
};

export const timeTravelSlice = createSlice({
    name: "timetravel",
    initialState,
    reducers: {
        travelForward: (state, action: PayloadAction<number>) => {
            state.amount += action.payload;
        },
        travelBackward: (state, action: PayloadAction<number>) => {
            state.amount -= action.payload;
        },
        resetTravel: (state) => {
            state.amount = 0;
        },
        enableTimeTravel: (state, action: PayloadAction<boolean>) => {
            state.enabled = action.payload;
        },
        showTimeTravel: (state, action: PayloadAction<boolean>) => {
            state.visible = action.payload;
        },
    },
});

export const { travelForward, travelBackward, resetTravel, enableTimeTravel, showTimeTravel } = timeTravelSlice.actions;
