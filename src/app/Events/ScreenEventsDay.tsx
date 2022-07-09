import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { clone } from "lodash";
import { FC, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Button } from "../../components/Containers/Button";
import { PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { useGetEventRoomsQuery, useGetEventsQuery, useGetEventTracksQuery } from "../../store/eurofurence.service";
import { EventDayRecord } from "../../store/eurofurence.types";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";
import { EventsNavigatorParamsList } from "./ScreenEvents";

export type ScreenEventsDayParams = {
    day: EventDayRecord;
};

export type ScreenEventsDayProps = CompositeScreenProps<PagesScreenProps<EventsNavigatorParamsList, any>, StackScreenProps<ScreenStartNavigatorParamsList>>;

export const ScreenEventsDay: FC<ScreenEventsDayProps> = ({ navigation, route }) => {
    const day = route.params.day;

    const events = useGetEventsQuery();
    const tracks = useGetEventTracksQuery();
    const rooms = useGetEventRoomsQuery();

    const ready = events.isSuccess && tracks.isSuccess && rooms.isSuccess;

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
    return (
        <View style={StyleSheet.absoluteFill}>
            <ScrollView>
                {!ready || !events.data
                    ? null
                    : events.data
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
