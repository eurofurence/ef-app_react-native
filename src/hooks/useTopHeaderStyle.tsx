import { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useTopHeaderStyle = () => {
    const safeInsets = useSafeAreaInsets();

    return useMemo(() => ({ paddingTop: 30 + safeInsets.top }), [safeInsets]);
};
