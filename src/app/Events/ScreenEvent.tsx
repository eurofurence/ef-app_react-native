import { StackScreenProps } from "@react-navigation/stack";
import { FC, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "../../components/Containers/Header";
import { Scroller } from "../../components/Containers/Scroller";
import { useGetEventByIdQuery, useGetEventDayByIdQuery, useGetEventRoomByIdQuery, useGetEventTrackByIdQuery } from "../../store/eurofurence.service";
import { EventDayRecord, EventRecord, EventRoomRecord, EventTrackRecord } from "../../store/eurofurence.types";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";
import { ContentEvent } from "./ContentEvent";

export type ScreenEventsParams = {
    // TODO: This could be a discriminative union, would need some type checking.
    id?: string;
    event?: EventRecord;
    day?: EventDayRecord;
    track?: EventTrackRecord;
    room?: EventRoomRecord;
};

export type ScreenEventProps = StackScreenProps<ScreenStartNavigatorParamsList, "Event">;

export const ScreenEvent: FC<ScreenEventProps> = ({ route }) => {
    const id = route.params.id;

    const eventParam = route.params.event;
    const eventRemote = useGetEventByIdQuery(id as string, { skip: !!eventParam || !id });
    const event = useMemo(() => eventParam ?? eventRemote.data, [eventParam, eventRemote]);

    const dayParam = route.params.day;
    const dayRemote = useGetEventDayByIdQuery(event?.ConferenceDayId as string, { skip: !!dayParam || !event?.ConferenceDayId });
    const day = useMemo(() => dayParam ?? dayRemote.data, [dayParam, dayRemote]);

    const trackParam = route.params.track;
    const trackRemote = useGetEventTrackByIdQuery(event?.ConferenceTrackId as string, { skip: !!trackParam || !event?.ConferenceTrackId });
    const track = useMemo(() => trackParam ?? trackRemote.data, [trackParam, trackRemote]);

    const roomParam = route.params.room;
    const roomRemote = useGetEventRoomByIdQuery(event?.ConferenceRoomId as string, { skip: !!trackParam || !event?.ConferenceRoomId });
    const room = useMemo(() => roomParam ?? roomRemote.data, [roomParam, roomRemote]);

    const top = useSafeAreaInsets()?.top;
    const headerStyle = useMemo(() => ({ paddingTop: 30 + top }), [top]);

    return (
        <View style={StyleSheet.absoluteFill}>
            <Header style={headerStyle}>{event?.Title ?? "Viewing event"}</Header>
            <Scroller>{!event ? null : <ContentEvent event={event} day={day} track={track} room={room} />}</Scroller>
        </View>
    );
};
