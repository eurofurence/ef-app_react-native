import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { SynchronizationProvider } from "./components/sync/SynchronizationProvider";
import { useAnalyticsManager } from "./hooks/analytics/useAnalyticsManager";
import { useNotificationReceivedManager } from "./hooks/notifications/useNotificationReceivedManager";
import { useNotificationRespondedManager } from "./hooks/notifications/useNotificationRespondedManager";
import { useBackgroundSyncManager } from "./hooks/sync/useBackgroundSyncManager";
import { useColorSchemeManager } from "./hooks/themes/useColorSchemeManager";
import { useTokenManager } from "./hooks/tokens/useTokenManager";
import { IndexRouter } from "./routes/IndexRouter";

/**
 * Base App. Handles all ui related layout stuff. Context providers go in index.tsx. Actual UI content should be in screens or components
 */
export function App() {
    useAnalyticsManager();
    useColorSchemeManager();
    useBackgroundSyncManager();
    useTokenManager();
    useNotificationReceivedManager();
    useNotificationRespondedManager();
    return (
        <SafeAreaProvider>
            <BottomSheetModalProvider>
                <SynchronizationProvider>
                    <IndexRouter />
                </SynchronizationProvider>
            </BottomSheetModalProvider>
        </SafeAreaProvider>
    );
}
