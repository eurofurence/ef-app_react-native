import { StackScreenProps } from "@react-navigation/stack";
import { FC, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "../../components/Containers/Header";
import { Scroller } from "../../components/Containers/Scroller";
import { useSignalLoading } from "../../context/LoadingContext";
import { useGetEventByIdQuery, useGetEventDayByIdQuery, useGetEventRoomByIdQuery, useGetEventTrackByIdQuery } from "../../store/eurofurence.service";
import { EventDayRecord, EventRecord, EventRoomRecord, EventTrackRecord } from "../../store/eurofurence.types";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";
import { ContentEvent } from "./ContentEvent";

/**
 * Params handled by the screen in route.
 */
export type ScreenEventParams = {
    // TODO: This could be a discriminative union, would need some type checking.
    /**
     * The ID, needed if the event is not passed explicitly, i.e., as an external link.
     */
    id?: string;

    /**
     * The event to display.
     */
    event?: EventRecord;

    /**
     * The day of the event or undefined to resolve.
     */
    day?: EventDayRecord;

    /**
     * The track of the event or undefined to resolve.
     */
    track?: EventTrackRecord;

    /**
     * The room of the event or undefined to resolve.
     */
    room?: EventRoomRecord;
};

/**
 * Properties to the screen as a component.
 */
export type ScreenEventProps = StackScreenProps<ScreenStartNavigatorParamsList, "Event">;

export const ScreenEvent: FC<ScreenEventProps> = ({ route }) => {
    // Use the ID param.
    const id = route.params.id;

    // Get the passed event or resolve remotely. If given in the route parameters, the query will not be executed.
    const eventParam = route.params.event;
    const eventRemote = useGetEventByIdQuery(id as string, { skip: !!eventParam || !id });
    const event = useMemo(() => eventParam ?? eventRemote.data, [eventParam, eventRemote]);

    // Get or use day.
    const dayParam = route.params.day;
    const dayRemote = useGetEventDayByIdQuery(event?.ConferenceDayId as string, { skip: !!dayParam || !event?.ConferenceDayId });
    const day = useMemo(() => dayParam ?? dayRemote.data, [dayParam, dayRemote]);

    // Get or use track.
    const trackParam = route.params.track;
    const trackRemote = useGetEventTrackByIdQuery(event?.ConferenceTrackId as string, { skip: !!trackParam || !event?.ConferenceTrackId });
    const track = useMemo(() => trackParam ?? trackRemote.data, [trackParam, trackRemote]);

    // Get or use room.
    const roomParam = route.params.room;
    const roomRemote = useGetEventRoomByIdQuery(event?.ConferenceRoomId as string, { skip: !!trackParam || !event?.ConferenceRoomId });
    const room = useMemo(() => roomParam ?? roomRemote.data, [roomParam, roomRemote]);

    // Signal if any query is active.
    useSignalLoading(eventRemote.isFetching || dayRemote.isFetching || trackRemote.isFetching || roomRemote.isFetching);

    // TODO Shared pattern.
    const top = useSafeAreaInsets()?.top;
    const headerStyle = useMemo(() => ({ paddingTop: 30 + top }), [top]);

    return (
        <View style={StyleSheet.absoluteFill}>
            <Header style={headerStyle}>{event?.Title ?? "Viewing event"}</Header>
            <Scroller>{!event ? null : <ContentEvent event={event} day={day} track={track} room={room} />}</Scroller>
        </View>
    );
};
