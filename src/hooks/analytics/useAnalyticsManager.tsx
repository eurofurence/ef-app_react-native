import analytics from "@react-native-firebase/analytics";
import { captureException, setTag, setUser } from "@sentry/react-native";
import Constants from "expo-constants";
import { useEffect } from "react";

import { useAuthContext } from "../../context/AuthContext";
import { useAppSelector } from "../../store";

/**
 * Manages data collection settings transfer. Sets up a connection for user and
 * app version to sentry.
 * @constructor
 */
export const useAnalyticsManager = () => {
    // Get user and analytics-enabled status from app store.
    const { user } = useAuthContext();
    const enabled = useAppSelector((state) => state.settingsSlice.analytics.enabled);

    // Enable analytics collection if enabled-flag reads true from the app store.
    useEffect(() => {
        analytics().setAnalyticsCollectionEnabled(enabled).catch(captureException);
    }, [enabled]);

    useEffect(() => {
        // Set user for sentry, if user is given.
        if (user) setUser({ id: user.uid as string, username: user.name as string });
        else setUser(null);

        // Set app version code.
        setTag("appVersionCode", Constants.expoConfig?.android?.versionCode);

        // Initialize firebase analytics user if given.
        analytics()
            .setUserId((user?.uid ?? null) as string | null)
            .catch(captureException);

        // Initialize firebase username if given.
        analytics()
            .setUserProperty("username", (user?.name ?? null) as string | null)
            .catch(captureException);
    }, [user]);
};
