import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { wrap as sentryWrap } from "@sentry/react-native";

import { ScreenStart } from "./app/ScreenStart";
import { SynchronizationProvider } from "./components/app/sync/SynchronizationProvider";
import { useAnalyticsManager } from "./hooks/analytics/useAnalyticsManager";
import { useNotificationReceivedManager } from "./hooks/notifications/useNotificationReceivedManager";
import { useNotificationRespondedManager } from "./hooks/notifications/useNotificationRespondedManager";
import { useBackgroundSyncManager } from "./hooks/sync/useBackgroundSyncManager";
import { useColorSchemeManager } from "./hooks/themes/useColorSchemeManager";
import { useTokenManager } from "./hooks/tokens/useTokenManager";

/**
 * Base App. Handles all ui related layout stuff. Context providers go in index.tsx. Actual UI content should be in screens or components
 */
function App() {
    useAnalyticsManager();
    useColorSchemeManager();
    useBackgroundSyncManager();
    useTokenManager();
    useNotificationReceivedManager();
    useNotificationRespondedManager();
    return (
        <BottomSheetModalProvider>
            <SynchronizationProvider>
                <ScreenStart />
            </SynchronizationProvider>
        </BottomSheetModalProvider>
    );
}

export default sentryWrap(App);
