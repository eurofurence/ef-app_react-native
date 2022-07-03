import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { PlatformCacheSynchronizer } from "./components/CacheSynchronizer/CacheSynchronizer";
import { PlatformNotificationManager } from "./components/Notifications/NotificationManager";
import { StartScreen } from "./screens/StartScreen";

/**
 * Base App. Handles all ui related layout stuff. Context providers go in index.tsx. Actual UI content should be in screens or components
 */
export default function App() {
    return (
        <GestureHandlerRootView style={styles.container}>
            <StatusBar style="auto" />
            <StartScreen />

            <PlatformNotificationManager />
            <PlatformCacheSynchronizer />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});
