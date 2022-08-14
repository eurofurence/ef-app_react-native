import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Sentry from "sentry-expo";

import { ScreenStart } from "./app/ScreenStart";
import { AnalyticsManager } from "./components/Managers/AnalyticsManager";
import { PlatformBackgroundSyncManager } from "./components/Managers/BackgroundSyncManager";
import { PlatformNotificationReceivedManager } from "./components/Managers/NotificationReceivedManager";
import { PlatformNotificationRespondedManager } from "./components/Managers/NotificationRespondedManager";
import { PlatformTokenManager } from "./components/Managers/TokenManager";
import { EventsSearchProvider } from "./components/Searching/EventsSearchContext";
import { SynchronizationProvider } from "./components/Synchronization/SynchronizationProvider";
import { NavigationProvider, sentryRoutingInstrumentation } from "./context/NavigationProvider";

Sentry.init({
    dsn: "https://f3baa5424fef43dfa5e2e881b37c13de@o1343479.ingest.sentry.io/6647748",
    enableInExpoDevelopment: false,
    debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
    tracesSampleRate: 0.2,
    integrations: [
        new Sentry.Native.ReactNativeTracing({
            tracingOrigins: ["localhost", "app.eurofurence.org"],
            routingInstrumentation: sentryRoutingInstrumentation,
        }),
    ],
});

/**
 * Base App. Handles all ui related layout stuff. Context providers go in index.tsx. Actual UI content should be in screens or components
 */
function App() {
    return (
        <GestureHandlerRootView style={[StyleSheet.absoluteFill, styles.container]}>
            <BottomSheetModalProvider>
                <SynchronizationProvider>
                    <EventsSearchProvider>
                        <NavigationProvider>
                            <ScreenStart />

                            {/* Handle device token acquisition. */}
                            <PlatformTokenManager />

                            {/* Handle handling notifications in foreground. */}
                            <PlatformNotificationReceivedManager />
                            <PlatformNotificationRespondedManager />

                            {/* Handle notifications in background. */}
                            <PlatformBackgroundSyncManager />

                            {/* Set up analytics. */}
                            <AnalyticsManager />
                        </NavigationProvider>
                    </EventsSearchProvider>
                </SynchronizationProvider>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
    },
});

export default Sentry.Native.wrap(App);
