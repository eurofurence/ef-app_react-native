import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { FC } from "react";
import { View, StyleSheet, ScrollView } from "react-native";

import { Section } from "../../components/Atoms/Section";
import { Scroller } from "../../components/Containers/Scroller";
import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { useTopHeaderStyle } from "../../hooks/useTopHeaderStyle";
import { FavoriteEventsList } from "../Events/FavoriteEventsList";
import { UpcomingEventsList } from "../Events/UpcomingEventsList";
import { ScreenAreasParamsList } from "../ScreenAreas";
import { ScreenStartParamsList } from "../ScreenStart";
import { CountdownHeader } from "./CountdownHeader";
import { DeviceSpecificWarnings } from "./DeviceSpecificWarnings";

/**
 * Params handled by the screen in route, nothing so far.
 */
export type ScreenHomeParams = undefined;

/**
 * The properties to the screen as a component.
 */
export type ScreenHomeProps = CompositeScreenProps<TabScreenProps<ScreenAreasParamsList, "Home">, StackScreenProps<ScreenStartParamsList>>;

export const HomeScreen: FC<ScreenHomeProps> = () => {
    const headerStyle = useTopHeaderStyle();
    return (
        <ScrollView style={StyleSheet.absoluteFill}>
            <CountdownHeader />
            <View style={{ padding: 16, flex: 1 }}>
                <DeviceSpecificWarnings />
                <UpcomingEventsList />
                <FavoriteEventsList />
            </View>
        </ScrollView>
    );
};
