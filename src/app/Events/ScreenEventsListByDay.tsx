import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { clone } from "lodash";
import { FC, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Button } from "../../components/Containers/Button";
import { PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { useSignalLoading } from "../../context/LoadingContext";
import { useGetEventRoomsQuery, useGetEventsQuery, useGetEventTracksQuery } from "../../store/eurofurence.service";
import { EventDayRecord } from "../../store/eurofurence.types";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";
import { ScreenEventsTabsNavigatorParamsList } from "./ScreenEventsTabs";

/**
 * Params handled by the screen in route.
 */
export type ScreenEventsListByDayParams = {
    /**
     * The day that's events are listed.
     */
    day: EventDayRecord;
};

/**
 * The properties to the screen as a component.
 */
export type ScreenEventsListByDayProps = CompositeScreenProps<PagesScreenProps<ScreenEventsTabsNavigatorParamsList, any>, StackScreenProps<ScreenStartNavigatorParamsList>>;

export const ScreenEventsListByDay: FC<ScreenEventsListByDayProps> = ({ navigation, route }) => {
    // Get the day.
    const day = route.params.day;

    // Use events, tracks, and rooms.
    const events = useGetEventsQuery();
    const tracks = useGetEventTracksQuery();
    const rooms = useGetEventRoomsQuery();

    // Ready if all queries are ready.
    const ready = events.isSuccess && tracks.isSuccess && rooms.isSuccess;

    // Indicate if queries are active.
    useSignalLoading(events.isFetching || tracks.isFetching || rooms.isFetching);

    // Prepare navigation callback. This clones the respective parameters, as otherwise illegal mutation will occur.
    const navigateTo = useCallback(
        (event) =>
            navigation.push("Event", {
                id: event.Id,
                event: clone(event),
                day: clone(day),
                track: clone(tracks.data?.find((track) => track.Id === event.ConferenceTrackId)),
                room: clone(rooms.data?.find((room) => room.Id === event.ConferenceRoomId)),
            }),
        [navigation, tracks, rooms]
    );

    // Do not render content when nothing is present. TODO: Loading content.
    if (!ready || !events.data) return null;

    return (
        <View style={StyleSheet.absoluteFill}>
            <ScrollView>
                {events.data
                    .filter((event) => event.ConferenceDayId === day.Id)
                    .map((event) => (
                        <View key={event.Id} style={{ padding: 10 }}>
                            <Button outline onPress={() => navigateTo(event)}>
                                {event.Title}
                            </Button>
                        </View>
                    ))}
            </ScrollView>
        </View>
    );
};
