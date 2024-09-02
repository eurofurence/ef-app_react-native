import * as analytics from "firebase/analytics";
import { useMemo } from "react";

import { firebaseApp } from "../../init/firebaseApp";
import { useAppSelector } from "../../store";

type LogEvent = (name: string, params: Record<string, any>) => Promise<void>;

export const useAnalytics = () => {
    const enabled = useAppSelector((state) => state.settingsSlice.analytics.enabled);
    const instance = useMemo(() => analytics.getAnalytics(firebaseApp), []);

    return useMemo((): LogEvent => {
        if (enabled) {
            return async (name, properties) => analytics.logEvent(instance, name, properties);
        } else {
            return async () => {};
        }
    }, [enabled, instance]);
};
