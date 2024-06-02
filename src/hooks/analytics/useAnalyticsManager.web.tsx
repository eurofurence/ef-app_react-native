import { captureException, setTag, setUser } from "@sentry/react-native";
import Constants from "expo-constants";
import * as analytics from "firebase/analytics";
import { useEffect, useMemo } from "react";

import { firebaseApp } from "../../firebaseApp";
import { useAppSelector } from "../../store";

/**
 * Manages data collection settings transfer. Sets up a connection for user and
 * app version to sentry.
 * @constructor
 */
export const useAnalyticsManager = () => {
    // Get user and analytics-enabled status from app store.
    const user = useAppSelector((state) => state.authorization);
    const enabled = useAppSelector((state) => state.settingsSlice.analytics.enabled);

    // Get an instance of analytics for the Firebase app.
    const instance = useMemo(() => analytics.getAnalytics(firebaseApp), []);

    // Enable analytics collection if enabled-flag reads true from the app stor
    useEffect(() => {
        try {
            analytics.setAnalyticsCollectionEnabled(instance, enabled);
        } catch (error) {
            captureException(error);
        }
    }, [instance, enabled]);

    useEffect(() => {
        // Set user for sentry, if user is given.
        if (user) setUser({ id: user.uid, username: user.username });
        else setUser(null);

        // Set app version code.
        setTag("appVersionCode", Constants.expoConfig?.android?.versionCode);

        try {
            // Initialize firebase analytics user if given.
            analytics.setUserId(instance, user?.uid ?? null);

            // Initialize firebase username if given.
            analytics.setUserProperties(instance, { username: user?.username ?? null });
        } catch (error) {
            captureException(error);
        }
    }, [instance, user]);
};
