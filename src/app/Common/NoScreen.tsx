import { FC } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Label } from "../../components/Atoms/Label";

export const NoScreen: FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
    const top = useSafeAreaInsets()?.top;
    return (
        <View style={{ padding: 30, paddingTop: top + (top ? 40 : 30) }}>
            <Label type="h1">{route.name}</Label>
            <Label type="h2">Screen not implemented yet</Label>
        </View>
    );
};
