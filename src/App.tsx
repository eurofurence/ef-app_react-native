import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ScreenStart } from "./app/ScreenStart";
import { PlatformNotificationManager } from "./components/Notifications/NotificationManager";
import { PlatformImageSynchronizer } from "./components/Utilities/ImageSynchronizer";
import { Synchronizer } from "./components/Utilities/Synchronizer";

/**
 * Base App. Handles all ui related layout stuff. Context providers go in index.tsx. Actual UI content should be in screens or components
 */
export default function App() {
    return (
        <GestureHandlerRootView style={[StyleSheet.absoluteFill, styles.container]}>
            <StatusBar style="auto" />
            <ScreenStart />

            <PlatformNotificationManager />
            <PlatformImageSynchronizer />
            <Synchronizer />
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
    },
});
