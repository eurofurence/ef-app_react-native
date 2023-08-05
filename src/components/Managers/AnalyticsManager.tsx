import analytics from "@react-native-firebase/analytics";
import Constants from "expo-constants";
import { useEffect } from "react";

import { PlatformSentry, captureException } from "../../sentryHelpers";
import { useAppSelector } from "../../store";

/**
 * Manages data collection settings transfer. Sets up a connection for user and
 * app version to sentry.
 * @constructor
 */
export const AnalyticsManager = () => {
    // Get user and analytics-enabled status from app store.
    const user = useAppSelector((state) => state.authorization);
    const enabled = useAppSelector((state) => state.settingsSlice.analytics.enabled);

    // Enable analytics collection if enabled-flag reads true from the app store.
    useEffect(() => {
        analytics().setAnalyticsCollectionEnabled(enabled).catch(captureException);
    }, [enabled]);

    useEffect(() => {
        // Set user for sentry, if user is given.
        if (user) PlatformSentry.setUser({ id: user.uid, username: user.username });
        else PlatformSentry.setUser(null);

        // Set app version code.
        PlatformSentry.setTag("appVersionCode", Constants.expoConfig?.android?.versionCode);

        // Initialize firebase analytics user if given.
        analytics()
            .setUserId(user?.uid ?? null)
            .catch(captureException);

        // Initialize firebase username if given.
        analytics()
            .setUserProperty("username", user?.username ?? null)
            .catch(captureException);
    }, [user]);

    return null;
};
