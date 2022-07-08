import { useRoute } from "@react-navigation/core";
import { FC } from "react";
import { View } from "react-native";

import { Label } from "../../components/Atoms/Label";

export const NoContent: FC<{ navigation: any; route: any }> = ({ navigation }) => {
    const route = useRoute();

    return (
        <View style={{ padding: 30 }}>
            <Label type="h1">{route.name}</Label>
            <Label type="h2">Content not implemented yet</Label>
        </View>
    );
};
