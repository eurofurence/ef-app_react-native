import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SettingsSliceState = {
    analytics: {
        enabled: boolean;
        prompted: boolean;
    };
    showDevMenu?: boolean;
};

export const settingsSlice = createSlice({
    name: "settingsSlice",
    initialState: {
        analytics: {
            enabled: false,
            prompted: false,
        },
        showDevMenu: false,
    } as SettingsSliceState,
    reducers: {
        setAnalytics: (state, action: PayloadAction<boolean>) => {
            state.analytics.enabled = action.payload;
            state.analytics.prompted = true;
        },
        showDevMenu: (state, action: PayloadAction<boolean>) => {
            state.showDevMenu = action.payload;
        },
        toggleDevMenu: (state, action: PayloadAction<boolean | undefined>) => {
            const newValue = action.payload !== undefined ? action.payload : !state.showDevMenu ?? true;

            state.showDevMenu = newValue;
        },
    },
});

export const { setAnalytics, showDevMenu, toggleDevMenu } = settingsSlice.actions;
