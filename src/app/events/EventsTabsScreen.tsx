import { CompositeScreenProps, useIsFocused } from "@react-navigation/core";
import { createMaterialTopTabNavigator, MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import moment from "moment";
import { FC, useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, Dimensions, Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EventsListByDayScreen, EventsListByDayScreenParams } from "./EventsListByDayScreen";
import { EventsListByRoomScreen, EventsListByRoomScreenParams } from "./EventsListByRoomScreen";
import { EventsListByTrackScreen, EventsListByTrackScreenParams } from "./EventsListByTrackScreen";
import { EventsListSearchResultsScreen, EventsListSearchResultsScreenParams } from "./EventsListSearchResultsScreen";
import { EventsSearchScreen, EventsSearchScreenParams } from "./EventsSearchScreen";
import { EventsTabsContextProvider, useEventsTabsContext } from "./EventsTabsContext";
import { EventActionsSheet } from "../../components/app/events/EventActionsSheet";
import { PersonalScheduleList } from "../../components/app/events/PersonalScheduleList";
import { Icon } from "../../components/generic/atoms/Icon";
import { TabScreenProps } from "../../components/generic/nav/TabsNavigator";
import { useTabStyles } from "../../components/generic/nav/useTabStyles";
import { useNow } from "../../hooks/time/useNow";
import { useAppSelector } from "../../store";
import { eventDaysSelectors, eventRoomsSelectors, eventTracksSelectors } from "../../store/eurofurence.selectors";
import { EventDayRecord } from "../../store/eurofurence.types";
import { ScreenAreasParamsList } from "../ScreenAreas";
import { ScreenStartParamsList } from "../ScreenStart";

// TODO: Might have an distinction between days, tracks, rooms as param.

/**
 * Available routes.
 */
export type EventsTabsScreenParamsList = {
    Favorites: object;
    Search: EventsSearchScreenParams;

    Results: EventsListSearchResultsScreenParams;
} & {
    /**
     * All names (days) want events-day parameters.
     */
    [name: string]: EventsListByDayScreenParams | EventsListByTrackScreenParams | EventsListByRoomScreenParams;
};

/**
 * Create an instance of the top tabs with the provided routes.
 */
const Tab = createMaterialTopTabNavigator<EventsTabsScreenParamsList>();

/**
 * Params handled by the screen in route. Delegated parameters for the days. TODO: Verify.
 */
export type EventsTabsScreenParams = NavigatorScreenParams<EventsTabsScreenParamsList> & {
    filterType?: "days" | "tracks" | "rooms";
};

/**
 * The properties to the screen as a component.
 */
export type EventsTabsScreenProps =
    // Route carrying from area screen at "Events", navigation via own parameter list and parents.
    CompositeScreenProps<
        TabScreenProps<ScreenAreasParamsList, "Events">,
        MaterialTopTabScreenProps<EventsTabsScreenParamsList> & TabScreenProps<ScreenAreasParamsList> & StackScreenProps<ScreenStartParamsList>
    >;

const EventsTabsScreenContent: FC<EventsTabsScreenProps> = ({ route }) => {
    const { t } = useTranslation("Events");
    const formatDay = useCallback((day: EventDayRecord) => moment(day.Date).format("ddd"), [t]);

    // Use now with optional time travel.
    const [now] = useNow();

    // Use event days.
    const days = useAppSelector(eventDaysSelectors.selectAll);
    const tracks = useAppSelector(eventTracksSelectors.selectAll);
    const rooms = useAppSelector(eventRoomsSelectors.selectAll);

    // Get context and resolve if results present and the current selection state..
    const { hasResults, selected, setSelected } = useEventsTabsContext();

    // Connect back handler to clearing selection.
    useEffect(() => {
        if (Platform.OS === "web") return;
        if (!selected) return;

        const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
            setSelected(null);
            return true;
        });

        return () => subscription.remove();
    }, [selected]);

    // Deselect on unfocus.
    const isFocused = useIsFocused();
    useEffect(() => {
        if (!isFocused) setSelected(null);
    }, [isFocused]);

    // Get the current day ID.
    const currentDayId = useMemo(() => days.find((day) => moment(day.Date).isSame(now, "day"))?.Id, [days, now]);

    // Get actual filter type, whether to scroll, and the initial route name.
    const type = hasResults ? "results" : route.params?.filterType ?? "days";
    const scroll = type === "tracks" || type === "rooms";
    let initial: string | undefined = undefined;
    if (type === "results") initial = "Results";
    else if (type === "days") initial = currentDayId ?? days[0]?.Id;
    else if (type === "tracks") initial = tracks[0]?.Id;
    else if (type === "rooms") initial = rooms[0]?.Id;

    // // Get common tab styles.
    const tabStyles = useTabStyles();
    const topInset = useSafeAreaInsets().top;

    // Ignore rendering if data is not loaded to prevent jumping on initialization.
    if (type === "days" && !days?.length) return null;
    if (type === "tracks" && !tracks?.length) return null;
    if (type === "rooms" && !rooms?.length) return null;

    // If the screens require too much performance we should set detach to true again.
    return (
        <View style={[StyleSheet.absoluteFill, { paddingTop: topInset }]}>
            <Tab.Navigator
                initialRouteName={initial}
                initialLayout={{
                    width: Dimensions.get("window").width,
                }}
                screenOptions={{
                    tabBarScrollEnabled: scroll,
                    tabBarItemStyle: scroll ? { width: 110 } : undefined,
                    lazy: true,
                    lazyPreloadDistance: 3,
                    tabBarStyle: { marginTop: topInset },
                }}
            >
                {/*Tab for searching and filtering*/}
                <Tab.Screen
                    name="Search"
                    options={{
                        tabBarShowLabel: false,
                        tabBarShowIcon: true,
                        tabBarIcon: ({ color }) => <Icon size={20} color={color} name="table-search" />,
                        tabBarLabelStyle: tabStyles.normal,
                    }}
                    component={EventsSearchScreen}
                />

                <Tab.Screen
                    name={"Your Schedule"}
                    options={{
                        tabBarShowLabel: false,
                        tabBarShowIcon: true,
                        tabBarIcon: ({ color }) => <Icon size={20} color={color} name="calendar" />,
                        tabBarLabelStyle: tabStyles.normal,
                    }}
                    component={PersonalScheduleList}
                />

                {type !== "results" ? null : (
                    <Tab.Screen
                        name="Results"
                        options={{ tabBarIcon: ({ color }) => <Icon size={20} color={color} name="view-list" />, tabBarLabelStyle: tabStyles.normal }}
                        component={EventsListSearchResultsScreen}
                    />
                )}

                {type !== "days"
                    ? null
                    : days.map((day) => (
                          <Tab.Screen
                              key={day.Id}
                              name={day.Id}
                              component={EventsListByDayScreen}
                              options={{
                                  title: formatDay(day),
                                  tabBarLabelStyle: day.Name === currentDayId ? tabStyles.highlight : tabStyles.normal,
                              }}
                          />
                      ))}

                {type !== "tracks"
                    ? null
                    : tracks.map((track) => (
                          <Tab.Screen key={track.Id} name={track.Id} component={EventsListByTrackScreen} options={{ title: track.Name, tabBarLabelStyle: tabStyles.normal }} />
                      ))}

                {type !== "rooms"
                    ? null
                    : rooms.map((room) => (
                          <Tab.Screen
                              key={room.Id}
                              name={room.Id}
                              component={EventsListByRoomScreen}
                              options={{ title: room.ShortName ?? room.Name, tabBarLabelStyle: tabStyles.normal }}
                          />
                      ))}
            </Tab.Navigator>
            <EventActionsSheet event={selected} onClose={() => setSelected(null)} />
        </View>
    );
};

export const EventsTabsScreen: FC<EventsTabsScreenProps> = ({ navigation, route }) => (
    <EventsTabsContextProvider>
        <EventsTabsScreenContent navigation={navigation} route={route} />
    </EventsTabsContextProvider>
);
