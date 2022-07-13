import { StackScreenProps } from "@react-navigation/stack";
import { FC, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "../../components/Containers/Header";
import { Scroller } from "../../components/Containers/Scroller";
import { useAppSelector } from "../../store";
import { eventDaysSelectors, eventRoomsSelectors, eventsSelector, eventTracksSelectors } from "../../store/eurofurence.selectors";
import { EventDayRecord, EventRecord, EventRoomRecord, EventTrackRecord } from "../../store/eurofurence.types";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";
import { EventContent } from "./EventContent";

/**
 * Params handled by the screen in route.
 */
export type EventScreenParams = {
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
export type EventScreenProps = StackScreenProps<ScreenStartNavigatorParamsList, "Event">;

export const EventScreen: FC<EventScreenProps> = ({ route }) => {
    // Use the ID param.
    const id = route.params.id;

    // Get the passed event or resolve from state.
    const eventParam = route.params.event;
    const eventRemote = useAppSelector((state) => (!eventParam && id ? eventsSelector.selectById(state, id) : undefined));
    const event = useMemo(() => eventParam ?? eventRemote, [eventParam, eventRemote]);

    // Get or use day.
    const dayParam = route.params.day;
    const dayRemote = useAppSelector((state) => (!dayParam && event?.ConferenceDayId ? eventDaysSelectors.selectById(state, event.ConferenceDayId) : undefined));
    const day = useMemo(() => dayParam ?? dayRemote, [dayParam, dayRemote]);

    // Get or use track.
    const trackParam = route.params.track;
    const trackRemote = useAppSelector((state) => (!trackParam && event?.ConferenceTrackId ? eventTracksSelectors.selectById(state, event.ConferenceTrackId) : undefined));
    const track = useMemo(() => trackParam ?? trackRemote, [trackParam, trackRemote]);

    // Get or use room.
    const roomParam = route.params.room;
    const roomRemote = useAppSelector((state) => (!roomParam && event?.ConferenceRoomId ? eventRoomsSelectors.selectById(state, event.ConferenceRoomId) : undefined));
    const room = useMemo(() => roomParam ?? roomRemote, [roomParam, roomRemote]);

    // TODO Shared pattern.
    const top = useSafeAreaInsets()?.top;
    const headerStyle = useMemo(() => ({ paddingTop: 30 + top }), [top]);

    return (
        <View style={StyleSheet.absoluteFill}>
            <Header style={headerStyle}>{event?.Title ?? "Viewing event"}</Header>
            <Scroller>{!event ? null : <EventContent event={event} day={day} track={track} room={room} />}</Scroller>
        </View>
    );
};
