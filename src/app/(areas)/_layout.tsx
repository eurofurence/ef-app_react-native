import "react-native-reanimated";
import { useColorScheme } from "@/hooks/themes/useColorScheme";
import { useBackgroundSyncManager } from "@/hooks/sync/useBackgroundSyncManager";

export default function RootLayout() {
    const colorScheme = useColorScheme();
    useBackgroundSyncManager();
    return <></>;
}
