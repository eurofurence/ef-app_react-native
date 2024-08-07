import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, useIsFocused } from "@react-navigation/core";
import { createMaterialTopTabNavigator, MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import moment from "moment";
import { FC, useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, Dimensions, Platform, StyleSheet, View } from "react-native";

import { EventsByDay, EventsByDayParams } from "./EventsByDay";
import { EventsByRoom, EventsByRoomParams } from "./EventsByRoom";
import { EventsByTrack, EventsByTrackParams } from "./EventsByTrack";
import { EventsRouterContextProvider, useEventsRouterContext } from "./EventsRouterContext";
import { EventsSearch, EventsSearchParams } from "./EventsSearch";
import { PersonalSchedule, PersonalScheduleParams } from "./PersonalSchedule";
import { EventActionsSheet } from "../../components/events/EventActionsSheet";
import { Icon } from "../../components/generic/atoms/Icon";
import { useTabStyles } from "../../components/generic/nav/useTabStyles";
import { useNow } from "../../hooks/time/useNow";
import { useAppSelector } from "../../store";
import { eventDaysSelectors, eventRoomsSelectors, eventTracksSelectors } from "../../store/eurofurence/selectors/records";
import { EventDayRecord } from "../../store/eurofurence/types";
import { AreasRouterParamsList } from "../AreasRouter";
import { IndexRouterParamsList } from "../IndexRouter";

// TODO: Might have an distinction between days, tracks, rooms as param.

/**
 * Available routes.
 */
export type EventsRouterParamsList = {
    Favorites: object;
    Search: EventsSearchParams;
    Personal: PersonalScheduleParams;
} & {
    /**
     * All names (days) want events-day parameters.
     */
    [name: string]: EventsByDayParams | EventsByTrackParams | EventsByRoomParams;
};

/**
 * Create an instance of the top tabs with the provided routes.
 */
const Tab = createMaterialTopTabNavigator<EventsRouterParamsList>();

/**
 * Params handled by the screen in route. Delegated parameters for the days. TODO: Verify.
 */
export type EventsRouterParams = NavigatorScreenParams<EventsRouterParamsList> & {
    filterType?: "days" | "tracks" | "rooms";
};

/**
 * The properties to the screen as a component.
 */
export type EventsRouterProps =
    // Route carrying from area screen at "Events", navigation via own parameter list and parents.
    CompositeScreenProps<
        BottomTabScreenProps<AreasRouterParamsList, "Events">,
        MaterialTopTabScreenProps<EventsRouterParamsList> & BottomTabScreenProps<AreasRouterParamsList> & StackScreenProps<IndexRouterParamsList>
    >;

/**
 * Controls and provides routing to event lists. Event items and feedback are pushed via the index router.
 * @constructor
 */
const EventsRouterContent: FC<EventsRouterProps> = ({ route }) => {
    const { t } = useTranslation("Events");
    const formatDay = useCallback((day: EventDayRecord) => moment(day.Date).format("ddd"), [t]);

    // Use now with optional time travel.
    const now = useNow();

    // Use event days.
    const days = useAppSelector(eventDaysSelectors.selectAll);
    const tracks = useAppSelector(eventTracksSelectors.selectAll);
    const rooms = useAppSelector(eventRoomsSelectors.selectAll);

    // Get context and resolve if results present and the current selection state..
    const { selected, setSelected } = useEventsRouterContext();

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
    const type = route.params?.filterType ?? "days";
    const scroll = type === "tracks" || type === "rooms";
    let initial: string | undefined = undefined;
    if (type === "days") initial = currentDayId ?? days[0]?.Id;
    else if (type === "tracks") initial = tracks[0]?.Id;
    else if (type === "rooms") initial = rooms[0]?.Id;

    // // Get common tab styles.
    const tabStyles = useTabStyles();

    // Ignore rendering if data is not loaded to prevent jumping on initialization.
    if (type === "days" && !days?.length) return null;
    if (type === "tracks" && !tracks?.length) return null;
    if (type === "rooms" && !rooms?.length) return null;

    // If the screens require too much performance we should set detach to true again.
    return (
        <View style={StyleSheet.absoluteFill}>
            <Tab.Navigator
                backBehavior="initialRoute"
                initialRouteName={initial}
                initialLayout={{
                    width: Dimensions.get("window").width,
                    height: Dimensions.get("window").height,
                }}
                screenOptions={{
                    tabBarScrollEnabled: scroll,
                    tabBarItemStyle: scroll ? { width: 110 } : undefined,
                    lazy: true,
                    lazyPreloadDistance: 3,
                }}
            >
                {/*Tab for searching and filtering*/}
                <Tab.Screen
                    key="search"
                    name="Search"
                    options={{
                        tabBarShowLabel: false,
                        tabBarShowIcon: true,
                        tabBarIcon: ({ color }) => <Icon size={20} color={color} name="table-search" />,
                        tabBarLabelStyle: tabStyles.normal,
                    }}
                    component={EventsSearch}
                />

                <Tab.Screen
                    key="schedule"
                    name="Personal"
                    options={{
                        title: "Your Schedule", // TODO: Translations for a bnch more
                        tabBarShowLabel: false,
                        tabBarShowIcon: true,
                        tabBarIcon: ({ color }) => <Icon size={20} color={color} name="calendar-heart" />,
                        tabBarLabelStyle: tabStyles.normal,
                    }}
                    component={PersonalSchedule}
                />

                {type !== "days"
                    ? null
                    : days.map((day) => (
                          <Tab.Screen
                              key={day.Id}
                              name={day.Id}
                              component={EventsByDay}
                              options={{
                                  title: formatDay(day),
                                  tabBarLabelStyle: day.Name === currentDayId ? tabStyles.highlight : tabStyles.normal,
                              }}
                          />
                      ))}

                {type !== "tracks"
                    ? null
                    : tracks.map((track) => (
                          <Tab.Screen key={track.Id} name={track.Id} component={EventsByTrack} options={{ title: track.Name, tabBarLabelStyle: tabStyles.normal }} />
                      ))}

                {type !== "rooms"
                    ? null
                    : rooms.map((room) => (
                          <Tab.Screen key={room.Id} name={room.Id} component={EventsByRoom} options={{ title: room.ShortName ?? room.Name, tabBarLabelStyle: tabStyles.normal }} />
                      ))}
            </Tab.Navigator>
            <EventActionsSheet event={selected} onClose={() => setSelected(null)} />
        </View>
    );
};

export const EventsRouter: FC<EventsRouterProps> = ({ navigation, route }) => (
    <EventsRouterContextProvider>
        <EventsRouterContent navigation={navigation} route={route} />
    </EventsRouterContextProvider>
);
