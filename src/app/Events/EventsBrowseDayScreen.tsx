import { clone } from "lodash";
import { FC, useCallback } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Button } from "../../components/Containers/Button";
import { useGetEventRoomsQuery, useGetEventsQuery, useGetEventTracksQuery } from "../../store/eurofurence.service";

export const EventsBrowserDayScreen: FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
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
                {!ready
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
