import { CompositeScreenProps, useRoute } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { FC } from "react";
import { View } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { ScreenAreasNavigatorParamsList } from "../ScreenAreas";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";

export type ScreenEmptyParams = undefined;

export type ScreenEmptyProps = CompositeScreenProps<TabScreenProps<ScreenAreasNavigatorParamsList, "Dealers">, StackScreenProps<ScreenStartNavigatorParamsList>>;

export const ScreenEmpty: FC<ScreenEmptyProps> = () => {
    const route = useRoute();

    return (
        <View style={{ padding: 30 }}>
            <Label type="h1">{route.name}</Label>
            <Label type="h2">Content not implemented yet</Label>
        </View>
    );
};
