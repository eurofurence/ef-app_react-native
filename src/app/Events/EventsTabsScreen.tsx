import { CompositeScreenProps, useIsFocused } from "@react-navigation/core";
import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import moment from "moment";
import { FC, useCallback, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { BackHandler, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EventActionsSheet } from "./EventActionsSheet";
import { EventsListByDayScreen, EventsListByDayScreenParams } from "./EventsListByDayScreen";
import { EventsListByRoomScreen, EventsListByRoomScreenParams } from "./EventsListByRoomScreen";
import { EventsListByTrackScreen, EventsListByTrackScreenParams } from "./EventsListByTrackScreen";
import { EventsListSearchResultsScreen, EventsListSearchResultsScreenParams } from "./EventsListSearchResultsScreen";
import { EventsSearchScreen, EventsSearchScreenParams } from "./EventsSearchScreen";
import { EventsTabsContextProvider, useEventsTabsContext } from "./EventsTabsContext";
import { PersonalScheduleList } from "./PersonalScheduleList";
import { createPagesNavigator, PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { useNow } from "../../hooks/useNow";
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
 * Create an instance of the pages-navigator with the provided routes.
 */
const EventsTabsScreenNavigator = createPagesNavigator<EventsTabsScreenParamsList>();

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
        PagesScreenProps<EventsTabsScreenParamsList> & TabScreenProps<ScreenAreasParamsList> & StackScreenProps<ScreenStartParamsList>
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

    // Convert given optional type to actual filter type.
    const actualType = useMemo(() => {
        if (hasResults) return "results";
        // TODO: @lukashaertel pls fix
        return route.params?.filterType ?? "days";
        // TODO: @lukashaertel pls fix
    }, [hasResults, route.params?.filterType]);

    // Get the current day ID.
    const currentDayId = useMemo(() => days.find((day) => moment(day.Date).isSame(now, "day"))?.Id, [days, now]);

    // Find initial name for selected type.
    const initialId = useMemo(() => {
        if (actualType === "results") return "Results";
        if (actualType === "days") return currentDayId ?? days[0]?.Id;
        if (actualType === "tracks") return tracks[0]?.Id;
        if (actualType === "rooms") return rooms[0]?.Id;
    }, [days, currentDayId, tracks, rooms, now, actualType]);

    // Compute the safe area.
    const top = useSafeAreaInsets()?.top;
    const pagesStyle = useMemo(() => ({ paddingTop: top }), [top]);

    // Ignore rendering if data is not loaded to prevent jumping on initialization.
    if (actualType === "days" && !days?.length) return null;
    if (actualType === "tracks" && !tracks?.length) return null;
    if (actualType === "rooms" && !rooms?.length) return null;

    // If the screens require too much performance we should set detach to true again.
    return (
        <View style={StyleSheet.absoluteFill}>
            <EventsTabsScreenNavigator.Navigator pagesStyle={pagesStyle} initialRouteName={initialId}>
                {/*Tab for searching and filtering*/}
                <EventsTabsScreenNavigator.Screen name="Search" options={{ icon: "table-search" }} component={EventsSearchScreen} />

                <EventsTabsScreenNavigator.Screen name={"Your Schedule"} options={{ icon: "calendar" }} component={PersonalScheduleList} />

                {actualType !== "results" ? null : <EventsTabsScreenNavigator.Screen name="Results" options={{ icon: "view-list" }} component={EventsListSearchResultsScreen} />}

                {actualType !== "days"
                    ? null
                    : days.map((day) => (
                          <EventsTabsScreenNavigator.Screen
                              key={day.Id}
                              name={day.Id}
                              component={EventsListByDayScreen}
                              options={{ title: formatDay(day), highlight: day.Name === currentDayId }}
                          />
                      ))}

                {actualType !== "tracks"
                    ? null
                    : tracks.map((track) => (
                          <EventsTabsScreenNavigator.Screen key={track.Id} name={track.Id} component={EventsListByTrackScreen} options={{ title: track.Name }} />
                      ))}

                {actualType !== "rooms"
                    ? null
                    : rooms.map((room) => (
                          <EventsTabsScreenNavigator.Screen key={room.Id} name={room.Id} component={EventsListByRoomScreen} options={{ title: room.ShortName ?? room.Name }} />
                      ))}
            </EventsTabsScreenNavigator.Navigator>
            <EventActionsSheet event={selected} onClose={() => setSelected(null)} />
        </View>
    );
};

export const EventsTabsScreen: FC<EventsTabsScreenProps> = ({ navigation, route }) => (
    <EventsTabsContextProvider>
        <EventsTabsScreenContent navigation={navigation} route={route} />
    </EventsTabsContextProvider>
);
