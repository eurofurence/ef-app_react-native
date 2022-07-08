import { FC, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "../../components/Containers/Header";
import { Scroller } from "../../components/Containers/Scroller";
import { useGetEventByIdQuery, useGetEventDayByIdQuery, useGetEventRoomByIdQuery, useGetEventTrackByIdQuery } from "../../store/eurofurence.service";
import { EventContent } from "./EventContent";

export const EventsDetailScreen: FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
    const id = route.params.id;

    const eventParam = route.params.event;
    const eventRemote = useGetEventByIdQuery(id as string, { skip: !!eventParam || !id });
    const event = useMemo(() => eventParam ?? eventRemote.data, [eventParam, eventRemote]);

    const dayParam = route.params.event;
    const dayRemote = useGetEventDayByIdQuery(event.ConferenceDayId as string, { skip: !!dayParam || !event?.ConferenceDayId });
    const day = useMemo(() => dayParam ?? dayRemote.data, [dayParam, dayRemote]);

    const trackParam = route.params.track;
    const trackRemote = useGetEventTrackByIdQuery(event.ConferenceTrackId as string, { skip: !!trackParam || !event?.ConferenceTrackId });
    const track = useMemo(() => trackParam ?? trackRemote.data, [trackParam, trackRemote]);

    const roomParam = route.params.room;
    const roomRemote = useGetEventRoomByIdQuery(event.ConferenceRoomId as string, { skip: !!trackParam || !event?.ConferenceRoomId });
    const room = useMemo(() => roomParam ?? roomRemote.data, [roomParam, roomRemote]);

    const top = useSafeAreaInsets()?.top;
    const headerStyle = useMemo(() => ({ paddingTop: 30 + top }), [top]);
    console.log(event);
    return (
        <View style={StyleSheet.absoluteFill}>
            <Header style={headerStyle}>{event.Title ?? "Viewing event"}</Header>
            <Scroller>
                <EventContent event={event} day={day} track={track} room={room} />
            </Scroller>
        </View>
    );
};
