import "react-native-reanimated";
import { useColorScheme } from "@/hooks/themes/useColorScheme";
import { useBackgroundSyncManager } from "@/hooks/sync/useBackgroundSyncManager";
import React from "react";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    useBackgroundSyncManager();
    return <></>;
}
