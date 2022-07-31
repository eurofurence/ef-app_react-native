import { useMemo } from "react";

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
    white: string;
    superSponsor: string;
    superSponsorText: string;
    sponsor: string;
    sponsorText: string;
};

export const useThemeType = (): "light" | "dark" => "light";

export const useTheme = (): Theme => {
    // Stub.

    return useMemo(
        () => ({
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
            white: "#ffffff",
            superSponsor: "#5300ff",
            superSponsorText: "#fff7f0",
            sponsor: "#ffd700",
            sponsorText: "#323034",
        }),
        []
    );
};

export const useThemeColor = (color: keyof Theme) => useTheme()[color];
