import { CompositeScreenProps } from "@react-navigation/core";
import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { clone } from "lodash";
import moment from "moment";
import { FC, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { createPagesNavigator } from "../../components/Navigators/PagesNavigator";
import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { useEventsSearchHasResults } from "../../components/Searching/EventsSearchContext";
import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { eventDaysSelectors, eventRoomsSelectors, eventTracksSelectors } from "../../store/eurofurence.selectors";
import { ScreenAreasNavigatorParamsList } from "../ScreenAreas";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";
import { EventsListByDayScreen, EventsListByDayScreenParams } from "./EventsListByDayScreen";
import { EventsListByRoomScreen, EventsListByRoomScreenParams } from "./EventsListByRoomScreen";
import { EventsListByTrackScreen, EventsListByTrackScreenParams } from "./EventsListByTrackScreen";
import { EventsListSearchResultsScreen, EventsListSearchResultsScreenParams } from "./EventsListSearchResultsScreen";
import { EventsSearchScreen, EventsSearchScreenParams } from "./EventsSearchScreen";

// TODO: Might have an distinction between days, tracks, rooms as param.

/**
 * Available routes.
 */
export type EventsTabsScreenNavigatorParamsList = {
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
const EventsTabsScreenNavigator = createPagesNavigator<EventsTabsScreenNavigatorParamsList>();

/**
 * Params handled by the screen in route. Delegated parameters for the days. TODO: Verify.
 */
export type EventsTabsScreenParams = NavigatorScreenParams<EventsTabsScreenNavigatorParamsList> & {
    filterType?: "days" | "tracks" | "rooms";
};

/**
 * The properties to the screen as a component.
 */
export type EventsTabsScreenProps = CompositeScreenProps<TabScreenProps<ScreenAreasNavigatorParamsList, "Events">, StackScreenProps<ScreenStartNavigatorParamsList>>;

export const EventsTabsScreen: FC<EventsTabsScreenProps> = ({ route }) => {
    // Use now with optional time travel.
    const [now] = useNow();

    // Use event days.
    const days = useAppSelector(eventDaysSelectors.selectAll);
    const tracks = useAppSelector(eventTracksSelectors.selectAll);
    const rooms = useAppSelector(eventRoomsSelectors.selectAll);

    // Use to display results tab.
    const hasSearchResults = useEventsSearchHasResults();
    console.log(hasSearchResults);

    // Convert given optional type to actual filter type.
    const actualType = useMemo(() => {
        if (hasSearchResults) return "results";
        return route.params?.filterType ?? "days";
    }, [hasSearchResults, route.params?.filterType]);

    // Find initial name for selected type.
    const initialName = useMemo(() => {
        if (actualType === "results") return "Results";
        if (actualType === "days") return days.find((day) => moment(day.Date).isSame(now, "day"))?.Name ?? days[0]?.Name;
        if (actualType === "tracks") return tracks[0]?.Name;
        if (actualType === "rooms") return rooms[0]?.Name;
    }, [days, tracks, rooms, now, actualType]);

    // Compute the safe area.
    const top = useSafeAreaInsets()?.top;
    const pagesStyle = useMemo(() => ({ paddingTop: top }), [top]);

    // Ignore rendering if data is not loaded to prevent jumping on initialization.
    if (actualType === "days" && !days?.length) return null;
    if (actualType === "tracks" && !tracks?.length) return null;
    if (actualType === "rooms" && !rooms?.length) return null;

    // If the screens require too much performance we should set detach to true again.
    return (
        <EventsTabsScreenNavigator.Navigator pagesStyle={pagesStyle} initialRouteName={initialName}>
            {/*Tab for searching and filtering*/}
            <EventsTabsScreenNavigator.Screen name="Search" options={{ icon: "search" }} component={EventsSearchScreen} />

            {actualType !== "results" ? null : <EventsTabsScreenNavigator.Screen name="Results" options={{ icon: "list" }} component={EventsListSearchResultsScreen} />}

            {actualType !== "days"
                ? null
                : days.map((day) => (
                      <EventsTabsScreenNavigator.Screen
                          key={day.Id}
                          name={day.Name}
                          component={EventsListByDayScreen}
                          options={{ title: moment(day.Date).format("ddd") }}
                          initialParams={{ day: clone(day) }}
                      />
                  ))}

            {actualType !== "tracks"
                ? null
                : tracks.map((track) => (
                      <EventsTabsScreenNavigator.Screen
                          key={track.Id}
                          name={track.Name}
                          component={EventsListByTrackScreen}
                          options={{ title: track.Name }}
                          initialParams={{ track: clone(track) }}
                      />
                  ))}

            {actualType !== "rooms"
                ? null
                : rooms.map((room) => (
                      <EventsTabsScreenNavigator.Screen
                          key={room.Id}
                          name={room.Name}
                          component={EventsListByRoomScreen}
                          options={{ title: room.Name }}
                          initialParams={{ room: clone(room) }}
                      />
                  ))}
        </EventsTabsScreenNavigator.Navigator>
    );
};
