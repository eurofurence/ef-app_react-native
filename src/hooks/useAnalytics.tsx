import * as Analytics from "expo-firebase-analytics";
import { useMemo } from "react";

import { useAppSelector } from "../store";

type LogEvent = (name: string, params: Record<string, any>) => Promise<void>;

export const useAnalytics = () => {
    const enabled = useAppSelector((state) => state.settingsSlice.analytics.enabled);

    return useMemo((): LogEvent => {
        return enabled ? Analytics.logEvent : Promise.resolve;
    }, [enabled]);
};
