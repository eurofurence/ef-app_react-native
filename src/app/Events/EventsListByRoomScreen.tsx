import { FC } from "react";

import { Section } from "../../components/Atoms/Section";
import { useAppSelector } from "../../store";
import { eventsCompleteSelector } from "../../store/eurofurence.selectors";
import { EventRoomRecord } from "../../store/eurofurence.types";
import { EventsListByDayScreenProps } from "./EventsListByDayScreen";
import { EventsListGeneric } from "./EventsListGeneric";

/**
 * Params handled by the screen in route.
 */
export type EventsListByRoomScreenParams = {
    /**
     * The room that's events are listed.
     */
    room: EventRoomRecord;
};

/**
 * The properties to the screen as a component. TODO: Unify and verify types.
 */
export type EventsListByRoomScreenProps = EventsListByDayScreenProps;

export const EventsListByRoomScreen: FC<EventsListByRoomScreenProps> = ({ navigation, route }) => {
    // Get the room. Use it to resolve events to display.
    const room = "room" in route.params ? route.params?.room : null;
    const eventsByRoom = useAppSelector((state) => eventsCompleteSelector.selectByRoom(state, room?.Id ?? ""));

    return (
        <EventsListGeneric navigation={navigation} events={eventsByRoom} leader={<Section title={room?.Name ?? ""} subtitle={`${eventsByRoom.length} events`} />} cardType="time" />
    );
};
