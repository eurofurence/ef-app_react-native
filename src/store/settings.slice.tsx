import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AppTheme } from "../context/Theme";

type SettingsSliceState = {
    analytics: {
        enabled: boolean;
        prompted: boolean;
    };
    showDevMenu?: boolean;
    theme?: AppTheme;
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
            state.showDevMenu = action.payload !== undefined ? action.payload : !state.showDevMenu ?? true;
        },
        setTheme: (state, action: PayloadAction<AppTheme | undefined>) => {
            state.theme = action.payload;
        },
    },
});

export const { setAnalytics, showDevMenu, toggleDevMenu, setTheme } = settingsSlice.actions;
