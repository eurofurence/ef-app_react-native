import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";

import { NotificationManager } from "./components/Notifications/NotificationManager";
import { StartScreen } from "./screens/StartScreen";

/**
 * Base App. Handles all ui related layout stuff. Context providers go in index.tsx. Actual UI content should be in screens or components
 */
export default function App() {
    return (
        <View style={styles.container}>
            <NotificationManager />
            <StatusBar style="auto" />
            <StartScreen />
        </View>
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
