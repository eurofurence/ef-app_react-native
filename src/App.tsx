import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { wrap as sentryWrap } from "@sentry/react-native";

import { ScreenStart } from "./app/ScreenStart";
import { AnalyticsManager } from "./components/Managers/AnalyticsManager";
import { PlatformBackgroundSyncManager } from "./components/Managers/BackgroundSyncManager";
import { ColorSchemeManager } from "./components/Managers/ColorSchemeManager";
import { PlatformNotificationReceivedManager } from "./components/Managers/NotificationReceivedManager";
import { PlatformNotificationRespondedManager } from "./components/Managers/NotificationRespondedManager";
import { PlatformTokenManager } from "./components/Managers/TokenManager";
import { SynchronizationProvider } from "./components/Synchronization/SynchronizationProvider";
import { NavigationProvider } from "./context/NavigationProvider";

/**
 * Base App. Handles all ui related layout stuff. Context providers go in index.tsx. Actual UI content should be in screens or components
 */
function App() {
    return (
        <BottomSheetModalProvider>
            <SynchronizationProvider>
                <NavigationProvider>
                    <ScreenStart />

                    {/* Handles changes to the system's color scheme settings*/}
                    <ColorSchemeManager />

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
            </SynchronizationProvider>
        </BottomSheetModalProvider>
    );
}

export default sentryWrap(App);
