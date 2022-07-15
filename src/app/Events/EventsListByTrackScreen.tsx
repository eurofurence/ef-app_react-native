import { FC } from "react";

import { Section } from "../../components/Atoms/Section";
import { useAppSelector } from "../../store";
import { eventsCompleteSelector } from "../../store/eurofurence.selectors";
import { EventTrackRecord } from "../../store/eurofurence.types";
import { EventsListByDayScreenProps } from "./EventsListByDayScreen";
import { EventsListGeneric } from "./EventsListGeneric";

/**
 * Params handled by the screen in route.
 */
export type EventsListByTrackScreenParams = {
    /**
     * The track that's events are listed.
     */
    track: EventTrackRecord;
};

/**
 * The properties to the screen as a component. TODO: Unify and verify types.
 */
export type EventsListByTrackScreenProps = EventsListByDayScreenProps;

export const EventsListByTrackScreen: FC<EventsListByTrackScreenProps> = ({ navigation, route }) => {
    // Get the track. Use it to resolve events to display.
    const track = "track" in route.params ? route.params?.track : null;
    const eventsByTrack = useAppSelector((state) => eventsCompleteSelector.selectByTrack(state, track?.Id ?? ""));

    return (
        <EventsListGeneric
            navigation={navigation}
            events={eventsByTrack}
            leader={<Section title={track?.Name ?? ""} subtitle={`${eventsByTrack.length} events`} />}
            cardType="time"
        />
    );
};
