import { useMemo } from "react";
import { useColorScheme, ViewStyle } from "react-native";
import { shallowEqual } from "react-redux";

import { useAppSelector } from "../store";

export type Theme = Record<string, string> & {
    /**
     * Primary brand color.
     */
    primary: string;

    /**
     * Secondary "colorful" color.
     */
    secondary: string;

    /**
     * Background of element displayed within a screen.
     */
    background: string;

    /**
     * Lowest surface of the screen, i.e., the proper background color.
     */
    surface: string;

    /**
     * Opposite of background.
     */
    inverted: string;

    /**
     * Text color.
     */
    text: string;

    /**
     * Text color with emphasis.
     */
    important: string;

    /**
     Text color on inverted.
     */
    invText: string;

    /**
     * Text color with emphasis on inverted.
     */
    invImportant: string;

    /**
     * Warning background.
     */
    warning: string;

    /**
     * Notification color.
     */
    notification: string;

    /**
     * Pull towards black.
     */
    darken: string;

    /**
     * Pull towards light.
     */
    lighten: string;

    /**
     * Pull against background.
     */
    soften: string;

    /**
     * White.
     */
    white: string;

    /**
     * Background for super-sponsor badge.
     */
    superSponsor: string;

    /**
     * Background for sponsor badge.
     */
    sponsor: string;

    /**
     * Text on super-sponsor badge.
     */
    superSponsorText: string;

    /**
     * Text on sponsor badge.
     */
    sponsorText: string;

    /**
     * Map marker.
     */
    marker: string;
};

// Resolve from system selection. Later, menu entry done.
export const useThemeType = (): AppTheme => {
    const userTheme = useAppSelector((state) => state.settingsSlice.theme, shallowEqual);
    const systemTheme = useColorScheme();

    return userTheme ? userTheme : systemTheme ? systemTheme : "light";
};

/**
 * All theme definitions.
 */
const themes = {
    light: {
        primary: "#006459",
        secondary: "#3421bc",
        background: "#f7f7f7",
        surface: "#f0f0f0",
        inverted: "#040014",
        text: "#323034",
        important: "#000000",
        invText: "#fff7f0",
        invImportant: "#ffffff",
        warning: "#ee5e22",
        notification: "#d91c52",
        darken: "#04001440",
        lighten: "#f7f7f7a0",
        soften: "#040014a0",
        white: "#ffffff",
        superSponsor: "#5300ff",
        superSponsorText: "#fff7f0",
        sponsor: "#ffd700",
        sponsorText: "#323034",
        marker: "#ff2f66",
    },
    dark: {
        primary: "#37726d",
        secondary: "#917dff",
        background: "#212121",
        surface: "#000000",
        inverted: "#e0dedb",
        text: "#e0dedb",
        important: "#f1ede8",
        invText: "#131313",
        invImportant: "#000000",
        warning: "#ee5e22",
        notification: "#d91c52",
        darken: "#04001440",
        lighten: "#f7f7f780",
        soften: "#f7f7f7a0",
        white: "#ffffff",
        superSponsor: "#5300ff",
        superSponsorText: "#fff7f0",
        sponsor: "#ffd700",
        sponsorText: "#323034",
        marker: "#ff2f66",
    },
    requinard: {
        primary: "#fff100",
        secondary: "#dace00",
        background: "#2b2b2b",
        surface: "#414141",
        inverted: "#b0b0b0",
        text: "#e0dedb",
        important: "#f1ede8",
        invText: "#131313",
        invImportant: "#000000",
        warning: "#ee5e22",
        notification: "#d91c52",
        darken: "#04001440",
        lighten: "#f7f7f7a0",
        soften: "#f7f7f7a0",
        white: "#ffffff",
        superSponsor: "#5300ff",
        superSponsorText: "#fff7f0",
        sponsor: "#ffd700",
        sponsorText: "#323034",
        marker: "#ff2f66",
    },
};

export type AppTheme = keyof typeof themes;

export const useTheme = (): Theme => {
    // Use the selected theme type and resolve the values.
    const type = useThemeType();
    return useMemo(() => themes[type], [type]);
};

export const useThemeColor = (color: keyof Theme) => useTheme()[color];

export const useThemeBackground = (color: keyof Theme) => {
    const backgroundColor = useThemeColor(color);
    return useMemo<ViewStyle>(() => ({ backgroundColor }), [backgroundColor]);
};
