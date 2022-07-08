import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { StartScreen } from "./app/StartScreen";
import { PlatformCacheSynchronizer } from "./components/CacheSynchronizer/CacheSynchronizer";
import { PlatformNotificationManager } from "./components/Notifications/NotificationManager";

/**
 * Base App. Handles all ui related layout stuff. Context providers go in index.tsx. Actual UI content should be in screens or components
 */
export default function App() {
    return (
        <GestureHandlerRootView style={[StyleSheet.absoluteFill, styles.container]}>
            <StatusBar style="auto" />
            <StartScreen />

            <PlatformNotificationManager />
            <PlatformCacheSynchronizer />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
    },
});
