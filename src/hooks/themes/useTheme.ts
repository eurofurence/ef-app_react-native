import { useCallback, useMemo } from "react";
import { useColorScheme } from "react-native";
import { ThemeName } from "@/context/Theme";
import { defaultSettings, useDataCache } from "@/context/DataCacheProvider";

export function useTheme() {
    const systemTheme = useColorScheme();
    const { getCacheSync, saveCache } = useDataCache();
    const settings = useMemo(() => getCacheSync("settings", "settings")?.data ?? defaultSettings, [getCacheSync]);

    const theme = settings.theme;

    const setTheme = useCallback((newTheme: ThemeName | undefined) => {
        console.log("Setting theme", newTheme);
        const newSettings = {
            ...settings,
            theme: newTheme
        };
        saveCache("settings", "settings", newSettings);
    }, [settings, saveCache]);

    return {
        theme,
        setTheme,
        systemTheme
    };
}
