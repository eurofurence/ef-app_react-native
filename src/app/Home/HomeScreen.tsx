import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { FC } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { AnnouncementList } from "../Announcements/AnnouncementList";
import { CurrentEventList } from "../Events/CurrentEventsList";
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
    return (
        <ScrollView style={StyleSheet.absoluteFill}>
            <CountdownHeader />
            <View style={{ padding: 16, flex: 1 }}>
                <DeviceSpecificWarnings />
                <AnnouncementList />
                <CurrentEventList />
                <UpcomingEventsList />
                <FavoriteEventsList />
            </View>
        </ScrollView>
    );
};
