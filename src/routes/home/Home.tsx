import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { appStyles } from "../../components/app/AppStyles";
import { AnnouncementList } from "../../components/app/announce/AnnouncementList";
import { CurrentEventList } from "../../components/app/events/CurrentEventsList";
import { TodayScheduleList } from "../../components/app/events/TodayScheduleList";
import { UpcomingEventsList } from "../../components/app/events/UpcomingEventsList";
import { CountdownHeader } from "../../components/app/home/CountdownHeader";
import { DeviceSpecificWarnings } from "../../components/app/home/DeviceSpecificWarnings";
import { LanguageWarnings } from "../../components/app/home/LanguageWarnings";
import { useSynchronizer } from "../../components/app/sync/SynchronizationProvider";
import { Floater, padFloater } from "../../components/generic/containers/Floater";
import { AreasRouterParamsList } from "../AreasRouter";
import { IndexRouterParamsList } from "../IndexRouter";

/**
 * Params handled by the screen in route, nothing so far.
 */
export type HomeParams = undefined;

/**
 * The properties to the screen as a component.
 */
export type HomeProps = CompositeScreenProps<BottomTabScreenProps<AreasRouterParamsList, "Home">, StackScreenProps<IndexRouterParamsList>>;

export const Home: FC<HomeProps> = () => {
    const safe = useSafeAreaInsets();

    const { synchronize, isSynchronizing } = useSynchronizer();
    return (
        <ScrollView style={[appStyles.abs, safe]} refreshControl={<RefreshControl refreshing={isSynchronizing} onRefresh={synchronize} />}>
            <CountdownHeader />

            <Floater contentStyle={appStyles.trailer}>
                <LanguageWarnings parentPad={padFloater} />
                <DeviceSpecificWarnings />
                <AnnouncementList />
                <UpcomingEventsList />
                <TodayScheduleList />
                <CurrentEventList />
            </Floater>
        </ScrollView>
    );
};
