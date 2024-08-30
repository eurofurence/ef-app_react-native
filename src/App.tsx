import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AppErrorBoundary } from "./components/util/AppErrorBoundary";
import { useAnalyticsManager } from "./hooks/analytics/useAnalyticsManager";
import { useInitialSynchronization } from "./hooks/analytics/useInitialSynchronization";
import { useNotificationReceivedManager } from "./hooks/notifications/useNotificationReceivedManager";
import { useNotificationRespondedManager } from "./hooks/notifications/useNotificationRespondedManager";
import { useBackgroundSyncManager } from "./hooks/sync/useBackgroundSyncManager";
import { useImagePrefetch } from "./hooks/sync/useImagePrefetch";
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
    useInitialSynchronization();
    useImagePrefetch();
    useTokenManager();
    useNotificationReceivedManager();
    useNotificationRespondedManager();
    return (
        <SafeAreaProvider>
            <BottomSheetModalProvider>
                <AppErrorBoundary>
                    <IndexRouter />
                </AppErrorBoundary>
            </BottomSheetModalProvider>
        </SafeAreaProvider>
    );
}
