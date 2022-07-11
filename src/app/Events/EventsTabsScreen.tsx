import { CompositeScreenProps } from "@react-navigation/core";
import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { clone } from "lodash";
import moment from "moment";
import { FC, useEffect, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { createPagesNavigator } from "../../components/Navigators/PagesNavigator";
import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { eventDaysSelectors, eventRoomsSelectors, eventsSelector, eventTracksSelectors } from "../../store/eurofurence.selectors";
import { EventRecord } from "../../store/eurofurence.types";
import { ScreenAreasNavigatorParamsList } from "../ScreenAreas";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";
import { EventsListByDayScreen, EventsListByDayScreenParams } from "./EventsListByDayScreen";
import { EventsListByRoomScreen, EventsListByRoomScreenParams } from "./EventsListByRoomScreen";
import { EventsListByTrackScreen, EventsListByTrackScreenParams } from "./EventsListByTrackScreen";
import { EventsListSearchResultsScreen, EventsListSearchResultsScreenParams } from "./EventsListSearchResultsScreen";
import { EventsSearchContext } from "./EventsSearchContext";
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
    const events = useAppSelector(eventsSelector.selectAll);
    const days = useAppSelector(eventDaysSelectors.selectAll);
    const tracks = useAppSelector(eventTracksSelectors.selectAll);
    const rooms = useAppSelector(eventRoomsSelectors.selectAll);

    // Searching. TODO: In app state or as a proper context + provider
    const [search, setSearch] = useState<string>("");
    const [results, setResults] = useState<null | EventRecord[]>(null);

    // Convert given optional type to actual filter type.
    const actualType = useMemo(() => {
        if (results !== null) return "results";
        return route.params?.filterType ?? "days";
    }, [results, route.params?.filterType]);

    // Perform search.
    useEffect(() => {
        if (search.length < 3) {
            setResults(null);
            return;
        }

        const handle = setTimeout(() => {
            const searchActual = search.toLowerCase().trim();
            const results = events.filter(
                (event) =>
                    event.Title.toLowerCase().includes(searchActual) ||
                    event.SubTitle?.toLowerCase()?.includes(searchActual) ||
                    event.Abstract?.toLowerCase()?.includes(searchActual) ||
                    event.PanelHosts?.toLowerCase()?.includes(searchActual)
            );
            setResults(results);
        }, 100);

        return () => clearTimeout(handle);
    }, [events, search]);

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

    // If the screens require too much performance we should set detach to true again.
    return (
        <EventsSearchContext.Provider value={{ search, setSearch, results }}>
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
        </EventsSearchContext.Provider>
    );
};
