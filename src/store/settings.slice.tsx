import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SettingsSliceState = {
    analytics: {
        enabled: boolean;
        prompted: boolean;
    };
};

export const settingsSlice = createSlice({
    name: "settingsSlice",
    initialState: {
        analytics: {
            enabled: false,
            prompted: false,
        },
    } as SettingsSliceState,
    reducers: {
        setAnalytics: (state, action: PayloadAction<boolean>) => {
            state.analytics.enabled = action.payload;
            state.analytics.prompted = true;
        },
    },
});

export const { setAnalytics } = settingsSlice.actions;
