import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { ScreenStart } from "./app/ScreenStart";
import { AnalyticsManager } from "./components/Managers/AnalyticsManager";
import { PlatformBackgroundSyncManager } from "./components/Managers/BackgroundSyncManager";
import { PlatformNotificationReceivedManager } from "./components/Managers/NotificationReceivedManager";
import { PlatformNotificationRespondedManager } from "./components/Managers/NotificationRespondedManager";
import { PlatformTokenManager } from "./components/Managers/TokenManager";
import { EventsSearchProvider } from "./components/Searching/EventsSearchContext";
import { SynchronizationProvider } from "./components/Synchronization/SynchronizationProvider";
import { NavigationProvider } from "./context/NavigationProvider";

/**
 * Base App. Handles all ui related layout stuff. Context providers go in index.tsx. Actual UI content should be in screens or components
 */
export default function App() {
    return (
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
    );
}
