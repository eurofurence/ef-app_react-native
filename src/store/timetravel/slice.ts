import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Constants from "expo-constants";
import moment from "moment";

interface TimeTravelState {
    amount: number;
    enabled: boolean;
    visible: boolean;
}

const initialState: TimeTravelState = {
    amount: 0,
    enabled: false,
    visible: Constants.debugMode,
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
        travelToDate: (state, action: PayloadAction<string>) => {
            const now = moment().startOf("day");
            const target = moment(action.payload).startOf("day");
            state.amount = target.diff(now, "milliseconds");
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

export const { travelForward, travelBackward, travelToDate, resetTravel, enableTimeTravel, showTimeTravel } = timeTravelSlice.actions;

const getTimeInterval = (unit: moment.unitOfTime.DurationConstructor) => moment.duration(1, unit).asMilliseconds();
export const ONE_MINUTE = getTimeInterval("minute");
export const ONE_HOUR = getTimeInterval("hour");
export const ONE_DAY = getTimeInterval("day");
export const ONE_WEEK = getTimeInterval("week");
export const ONE_MONTH = getTimeInterval("month");
