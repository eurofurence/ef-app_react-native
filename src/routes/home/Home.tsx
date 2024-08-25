import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, useIsFocused } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";

import { appStyles } from "../../components/AppStyles";
import { RecentAnnouncements } from "../../components/announce/RecentAnnouncements";
import { CurrentEventList } from "../../components/events/CurrentEventsList";
import { TodayScheduleList } from "../../components/events/TodayScheduleList";
import { UpcomingEventsList } from "../../components/events/UpcomingEventsList";
import { Search } from "../../components/generic/atoms/Search";
import { Floater, padFloater } from "../../components/generic/containers/Floater";
import { CountdownHeader } from "../../components/home/CountdownHeader";
import { DeviceSpecificWarnings } from "../../components/home/DeviceSpecificWarnings";
import { FavoritesChangedWarning } from "../../components/home/FavoritesChangedWarning";
import { GlobalSearch } from "../../components/home/GlobalSearch";
import { LanguageWarnings } from "../../components/home/LanguageWarnings";
import { TimezoneWarning } from "../../components/home/TimezoneWarning";
import { useSynchronizer } from "../../components/sync/SynchronizationProvider";
import { useFuseIntegration } from "../../hooks/searching/useFuseIntegration";
import { useNow } from "../../hooks/time/useNow";
import { selectGlobalSearchIndex } from "../../store/eurofurence/selectors/search";
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

export const Home: FC<HomeProps> = ({ navigation }) => {
    const isFocused = useIsFocused();
    const now = useNow(isFocused ? 5 : "static");

    // Search integration.
    const [filter, setFilter, results] = useFuseIntegration(selectGlobalSearchIndex);

    const { synchronize, isSynchronizing } = useSynchronizer();
    return (
        <ScrollView style={StyleSheet.absoluteFill} refreshControl={<RefreshControl refreshing={isSynchronizing} onRefresh={synchronize} />}>
            <CountdownHeader />
            <Search filter={filter} setFilter={setFilter} />
            <Floater contentStyle={appStyles.trailer}>
                <LanguageWarnings parentPad={padFloater} />
                <TimezoneWarning parentPad={padFloater} />
                <DeviceSpecificWarnings />
                <FavoritesChangedWarning />
                {results ? (
                    <GlobalSearch navigation={navigation} now={now} results={results} />
                ) : (
                    <>
                        <RecentAnnouncements now={now} />
                        <UpcomingEventsList now={now} />
                        <TodayScheduleList now={now} />
                        <CurrentEventList now={now} />
                    </>
                )}
            </Floater>
        </ScrollView>
    );
};
