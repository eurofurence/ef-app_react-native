import { useMemo } from "react";
import { useColorScheme, ViewStyle } from "react-native";

export type Theme = Record<string, string> & {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    inverted: string;
    text: string;
    important: string;
    invText: string;
    invImportant: string;
    warning: string;
    notification: string;
    darken: string;
    lighten: string;
    soften: string;
    white: string;
    superSponsor: string;
    superSponsorText: string;
    sponsor: string;
    sponsorText: string;
    marker: string;
};

// Resolve from system selection. Later, menu entry done.
export const useThemeType = (): "light" | "dark" => useColorScheme() ?? "light";

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
        soften: "#04001440",
        white: "#ffffff",
        superSponsor: "#5300ff",
        superSponsorText: "#fff7f0",
        sponsor: "#ffd700",
        sponsorText: "#323034",
        marker: "#ff2f66",
    },
    dark: {
        primary: "#37726d",
        secondary: "#4631cc",
        background: "#252525",
        surface: "#2d2d2d",
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
