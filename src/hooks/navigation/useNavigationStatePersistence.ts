import AsyncStorage from "@react-native-async-storage/async-storage";
import { InitialState, NavigationState } from "@react-navigation/routers";
import { useCallback, useEffect, useState } from "react";
import { Linking, Platform } from "react-native";

/**
 * Creates a hook for initial state loading and saving.
 * @param persistenceKey
 * @return Returns if ready, the initial state, and the state changed callback.
 */
export const useNavigationStatePersistence = (persistenceKey = "NAVIGATION_STATE"): [boolean, InitialState | undefined, (state: NavigationState | undefined) => void] => {
    const [isReady, setIsReady] = useState<boolean>(false);
    const [initialState, setInitialState] = useState<InitialState>();

    const onStateChange = useCallback((state: NavigationState | undefined) => AsyncStorage.setItem(persistenceKey, JSON.stringify(state)), [persistenceKey]);

    useEffect(() => {
        // Already ready, skip.
        if (isReady) return;

        // Run initialization from store.
        (async () => {
            // Get initial URL and stored value.
            const [initialUrl, savedStateString] = await Promise.all([Linking.getInitialURL(), AsyncStorage.getItem(persistenceKey)]);

            // If web or initial URL is given, skip restoring.
            if (Platform.OS === "web" || initialUrl !== null) return;

            // If given, assign it as parsed from JSON.
            if (typeof savedStateString === "string") {
                setInitialState(JSON.parse(savedStateString));
            }
        })()
            .catch(console.error)
            .finally(() => setIsReady(true));
    }, [isReady]);

    // Return the values. Assert initial state, as it should only be used when it is to be used.
    return [isReady, initialState, onStateChange];
};
