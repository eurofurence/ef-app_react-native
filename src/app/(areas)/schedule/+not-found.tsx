import { Redirect, router, usePathname } from "expo-router";
import { StyleSheet, useWindowDimensions } from "react-native";
import { Route, TabBar, TabView } from "react-native-tab-view";
import * as React from "react";
import { Header } from "@/components/generic/containers/Header";
import { EventDayDetails } from "@/store/eurofurence/types";
import { useDataCache } from "@/context/DataCacheProvider";
import { EventsSectionedList } from "@/components/events/EventsSectionedList";
import { Label } from "@/components/generic/atoms/Label";
import { useTranslation } from "react-i18next";
import { useIsFocused } from "@react-navigation/core";
import { useNow } from "@/hooks/time/useNow";
import { useEventDayGroups, useEventOtherGroups } from "@/components/events/Events.common";
import { useZoneAbbr } from "@/hooks/time/useZoneAbbr";
import { chain, sortBy } from "lodash";
import { useMemo } from "react";
import { useThemeBackground } from "@/hooks/themes/useThemeHooks";
import { TabLabel } from "@/components/generic/atoms/TabLabel";

function SearchView() {
    return (
        <Header>Search</Header>
    );
}

function PersonalView() {
    const { t } = useTranslation("Events");
    const now = useNow("static");
    const zone = useZoneAbbr();
    const { getAllCacheSync } = useDataCache();

    const projected = useMemo(() =>
        chain(getAllCacheSync("events") || [])
            .map(item => item.data)
            .filter(item => item.Favorite)
            .sortBy("StartDateTimeUtc")
            .value(), [getAllCacheSync]);
    const eventGroups = useEventOtherGroups(t, now, zone, projected);

    return (
        <EventsSectionedList
            eventsGroups={eventGroups}
            select={() => {/*TODO, potentially via search param?*/
            }}
            cardType="time"
            leader={
                // TODO: Add avatar back.
                <Label type="lead" variant="middle" mt={30}>
                    {t("schedule_title")}
                </Label>
            }
            empty={
                <Label type="para" mt={20} ml={20} mr={20} variant="middle">
                    {t("schedule_empty")}
                </Label>
            }
        />
    );
}

function dayTabTitle(day: EventDayDetails) {
    const date = new Date(day.Date);
    return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
}

function DayView({ day }: { day: EventDayDetails }) {
    const { t } = useTranslation("Events");
    const { getAllCacheSync } = useDataCache();

    const isFocused = useIsFocused();
    const now = useNow(isFocused ? 5 : "static");
    const zone = useZoneAbbr();

    const projected = useMemo(() =>
        chain(getAllCacheSync("events") || [])
            .map(item => item.data)
            .filter(item => item.ConferenceDayId == day.Id)
            .sortBy("StartDateTimeUtc")
            .value(), [getAllCacheSync, day]);
    const eventsGroups = useEventDayGroups(t, now, zone, projected);

    return (
        <EventsSectionedList
            eventsGroups={eventsGroups}
            select={() => {/*TODO, potentially via search param?*/
            }}
            leader={
                <Label type="lead" variant="middle" mt={30}>
                    {day?.Name ?? ""}
                </Label>
            }
        />

    );
}

export const eventsRoutePrefix = "/schedule/";

export default function EventsScreen() {
    const pathname = usePathname();
    const key = pathname.startsWith(eventsRoutePrefix) ? pathname.substring(eventsRoutePrefix.length) : null;

    const { getAllCacheSync } = useDataCache();
    const days = useMemo(() =>
        sortBy(getAllCacheSync("eventDays"), "data.Date"), [getAllCacheSync]);

    const renderScene = React.useCallback(({ route }: { route: Route }) => {
        if (route.key === "search") return <SearchView />;
        if (route.key === "personal") return <PersonalView />;
        const item = days.find(item => item.data.Id == route.key);
        if (!item) return null;
        return <DayView day={item.data} />;
    }, [days]);

    const routes: Route[] = React.useMemo(
        () => [
            // TODO: it's not nice that those are under "schedule/"
            { key: "search", title: "Search" },
            { key: "personal", title: "Personal" },
            ...days.map(item => ({ key: item.data.Id, title: dayTabTitle(item.data) }))],
        [days]);

    const layout = useWindowDimensions();

    const sceneStyle = useThemeBackground("surface");
    const tabBarStyle = useThemeBackground("background");
    const indicatorStyle = useThemeBackground("secondary");

    const index = Math.max(0, routes.findIndex(item => item.key === key));

    if (!days?.length)
        return null;
    if (key == null)
        return <Redirect href={eventsRoutePrefix + days[0].data.Id} />;

    return (
        <TabView
            style={StyleSheet.absoluteFill}
            sceneContainerStyle={sceneStyle}
            renderTabBar={(props) =>
                <TabBar {...props}
                        key="tabbar"
                        renderLabel={({ focused, route }) => <TabLabel focused={focused}>{route.title}</TabLabel>}
                        style={tabBarStyle}
                        indicatorStyle={indicatorStyle}
                        onTabPress={(props) => {
                            // Replace tab press handling with immediate router navigation.
                            // Index-change handler will handle nothing in this case.
                            router.replace((eventsRoutePrefix + props.route.key) as string);
                            props.preventDefault();
                        }}
                        tabStyle={{ width: layout.width / routes.length }} />}
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={() => undefined}
            initialLayout={{ width: layout.width }}
        />
    );
}
