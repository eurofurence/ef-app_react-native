import { useCallback } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeName } from '@/context/Theme';
import { useDataCache } from '@/context/DataCacheProvider';

export function useTheme() {
    const systemTheme = useColorScheme();
    const { getCacheSync, saveCache } = useDataCache();
    const settings = getCacheSync("settings", "settings")?.data ?? {
        cid: "",
        cacheVersion: "",
        lastSynchronised: "",
        state: {},
        lastViewTimes: {},
    };
    const theme = settings.theme;

    const setTheme = useCallback((newTheme: ThemeName | undefined) => {
        const newSettings = {
            ...settings,
            theme: newTheme,
        };
        saveCache("settings", "settings", newSettings);
    }, [settings, saveCache]);

    return {
        theme,
        setTheme,
        systemTheme,
    };
} 