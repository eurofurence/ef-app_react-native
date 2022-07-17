import { useMemo } from "react";
import { ColorValue } from "react-native";

export type Theme = Record<string, ColorValue> & {
    primary: ColorValue;
    secondary: ColorValue;
    background: ColorValue;
    surface: ColorValue;
    inverted: ColorValue;
    text: ColorValue;
    important: ColorValue;
    invText: ColorValue;
    invImportant: ColorValue;
    notification: ColorValue;
    darken: ColorValue;
    lighten: ColorValue;
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
            notification: "#d91c52",
            darken: "#04001440",
            lighten: "#f7f7f760",
        }),
        []
    );
};
