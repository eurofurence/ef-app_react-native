import { useMemo } from "react";
import { TextStyle, ViewStyle } from "react-native";

import { useAppliedTheme, useBackgroundStyle, useBorderStyle, useColorStyle, useTheme as useThemeFromSelectors } from "../../store/settings/selectors";
import { Theme, ThemeColor } from "@/context/Theme";

export const useThemeName = () => useAppliedTheme();

export const useTheme = () => useThemeFromSelectors();

export const useThemeColorValue = (color: ThemeColor) => useTheme()[color];

export function useThemeColor(color: ThemeColor | "transparent"): Pick<TextStyle, "color"> & { color: string };
export function useThemeColor(color: null): null;
export function useThemeColor(color: ThemeColor | "transparent" | null): (Pick<TextStyle, "color"> & { color: string }) | null;
export function useThemeColor(color: ThemeColor | "transparent" | null) {
    const styles = useColorStyle();
    return color ? styles[color] : null;
}

export function useThemeBorder(color: ThemeColor | "transparent"): Pick<ViewStyle, "borderColor"> & { borderColor: string };
export function useThemeBorder(color: null): null;
export function useThemeBorder(color: ThemeColor | "transparent" | null): (Pick<ViewStyle, "borderColor"> & { borderColor: string }) | null;
export function useThemeBorder(color: ThemeColor | "transparent" | null) {
    const styles = useBorderStyle();
    return color ? styles[color] : null;
}

export function useThemeBackground(color: ThemeColor | "transparent"): Pick<ViewStyle, "backgroundColor"> & { backgroundColor: string };
export function useThemeBackground(color: null): null;
export function useThemeBackground(color: ThemeColor | "transparent" | null): (Pick<ViewStyle, "backgroundColor"> & { backgroundColor: string }) | null;
export function useThemeBackground(color: ThemeColor | "transparent" | null) {
    const styles = useBackgroundStyle();
    return color ? styles[color] : null;
}

export function useThemeMemo<T>(fn: (theme: Theme) => T) {
    const theme = useTheme();
    return useMemo(() => fn(theme), [theme]);
}
