import analytics from "@react-native-firebase/analytics";
import { useMemo } from "react";

import { useAppSelector } from "../../store";

type LogEvent = (name: string, params: Record<string, any>) => Promise<void>;

export const useAnalytics = () => {
    const enabled = useAppSelector((state) => state.settingsSlice.analytics.enabled);

    return useMemo((): LogEvent => {
        if (enabled) {
            return (name, properties) => {
                console.log("Log event", name, properties);
                return analytics().logEvent(name, properties);
            };
        } else {
            return () => Promise.resolve();
        }
    }, [enabled]);
};
