import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { AppState } from "react-native";

import { useSynchronizer } from "../../components/sync/SynchronizationProvider";
import { captureNotificationException } from "../../sentryHelpers";

const STORAGE_TAG_NAME = "background_sync_requested";

/**
 * Requests synchronization at the next possible time. Can be used in non-react
 * locations.
 */
export const requestSyncFromBackground = () => AsyncStorage.setItem(STORAGE_TAG_NAME, "true");

/**
 * On initialization, checks if a sync was requested from a non-react
 * location, such as background tasks.
 * @constructor
 */
export const useBackgroundSyncManager = () => {
    // Use synchronizer for performing data refresh.
    const { synchronize } = useSynchronizer();

    // Connect to app state events, check on active.
    useEffect(() => {
        const changed = AppState.addEventListener("change", (appState) => {
            // Not in foreground, skip.
            if (appState !== "active") return;

            // Handle background sync requests.
            (async () => {
                // Get from async storage, the background task will write this as
                // true when a sync request is sent.
                const data = await AsyncStorage.getItem(STORAGE_TAG_NAME);

                // If was not true, return false, otherwise synchronize, reset, and return true.
                if (data !== "true") {
                    return false;
                } else {
                    synchronize();
                    await AsyncStorage.removeItem(STORAGE_TAG_NAME);
                    return true;
                }
            })().then(
                (r) => console.log("Sync request checked, requested:", r),
                (e) => captureNotificationException("Sync request could not be checked", e),
            );
        });

        return () => {
            // Remove app state subscription.
            changed.remove();
        };
    }, []);
};
