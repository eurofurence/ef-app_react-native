import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Floater } from "../../components/Containers/Floater";
import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { useSynchronizer } from "../../components/Synchronization/SynchronizationProvider";
import { AnnouncementList } from "../Announcements/AnnouncementList";
import { appStyles } from "../AppStyles";
import { CurrentEventList } from "../Events/CurrentEventsList";
import { UpcomingEventsList } from "../Events/UpcomingEventsList";
import { UpcomingFavoriteEventsList } from "../Events/UpcomingFavoriteEventsList";
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
    const safe = useSafeAreaInsets();

    const { synchronize, isSynchronizing } = useSynchronizer();
    return (
        <ScrollView style={[appStyles.abs, safe]} refreshControl={<RefreshControl refreshing={isSynchronizing} onRefresh={synchronize} />}>
            <CountdownHeader />

            <Floater contentStyle={appStyles.trailer}>
                <DeviceSpecificWarnings />
                <AnnouncementList />
                <CurrentEventList />
                <UpcomingEventsList />
                <UpcomingFavoriteEventsList />
            </Floater>
        </ScrollView>
    );
};
