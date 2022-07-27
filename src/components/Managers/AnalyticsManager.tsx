import * as Analytics from "expo-firebase-analytics";
import { useEffect } from "react";

import { useAppSelector } from "../../store";
export const AnalyticsManager = () => {
    const enabled = useAppSelector((state) => state.settingsSlice.analytics.enabled);

    useEffect(() => {
        Analytics.setAnalyticsCollectionEnabled(enabled);
    }, [enabled]);

    return null;
};
