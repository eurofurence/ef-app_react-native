import { createSelector } from "@reduxjs/toolkit";
import { TextStyle, ViewStyle } from "react-native";

import { RootState } from "./index";
import { ThemeColor, ThemeName, themes } from "../context/Theme";

export const selectAppliedTheme = (state: RootState): ThemeName => state.settingsSlice.theme ?? state.settingsSlice.colorScheme ?? "light";

export const selectTheme = createSelector([selectAppliedTheme], (themeName) => {
    return themes[themeName];
});

export const selectColorStyle = createSelector([selectAppliedTheme], (themeName) => {
    const style: Record<string, TextStyle> = {};
    style.transparent = { color: "transparent" };
    for (const [key, color] of Object.entries(themes[themeName])) style[key] = { color };
    return style as Record<ThemeColor | "transparent", Pick<TextStyle, "color">>;
});

export const selectBorderStyle = createSelector([selectAppliedTheme], (themeName) => {
    const style: Record<string, ViewStyle> = {};
    style.transparent = { backgroundColor: "transparent" };
    for (const [key, color] of Object.entries(themes[themeName])) style[key] = { borderColor: color };
    return style as Record<ThemeColor | "transparent", Pick<ViewStyle, "borderColor">>;
});

export const selectBackgroundStyle = createSelector([selectAppliedTheme], (themeName) => {
    const style: Record<string, ViewStyle> = {};
    style.transparent = { backgroundColor: "transparent" };
    for (const [key, color] of Object.entries(themes[themeName])) style[key] = { backgroundColor: color };
    return style as Record<ThemeColor | "transparent", Pick<ViewStyle, "backgroundColor">>;
});
