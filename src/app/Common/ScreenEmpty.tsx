import { CompositeScreenProps, useRoute } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { FC } from "react";
import { View } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { useSignalLoading } from "../../context/LoadingContext";
import { ScreenAreasParamsList } from "../ScreenAreas";
import { ScreenStartParamsList } from "../ScreenStart";

/**
 * Params handled by the screen in route.
 */
export type ScreenEmptyParams = undefined;

/**
 * The properties to the screen as a component.
 */
export type ScreenEmptyProps = CompositeScreenProps<TabScreenProps<ScreenAreasParamsList, "Dealers">, StackScreenProps<ScreenStartParamsList>>;

/**
 * Placeholder screen.
 * @constructor
 */
export const ScreenEmpty: FC<ScreenEmptyProps> = () => {
    const route = useRoute();

    // Indicate loading, as content is not present.
    useSignalLoading(true);

    return (
        <View style={{ padding: 30, paddingTop: 60 }}>
            <Label type="h1">{route.name}</Label>
            <Label type="h2">Content not implemented yet</Label>
        </View>
    );
};
