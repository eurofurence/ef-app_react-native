import moment from "moment";
import { FC, useCallback } from "react";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { Col } from "../../components/Containers/Col";
import { useTheme } from "../../context/Theme";
import { useAppSelector } from "../../store";
import { eventsCompleteSelector, EventWithDetails } from "../../store/eurofurence.selectors";
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

    // This renderer for the pre-section generates the day and time, as they are not displayed on this page.
    const theme = useTheme();
    const renderPre = useCallback(
        (event: EventWithDetails, inv: boolean) => {
            const start = moment(event.StartDateTimeUtc);
            return (
                <Col type="center">
                    <Label type="caption" color={inv ? "invText" : "important"}>
                        {start.format("ddd")}
                    </Label>
                    <Label color={inv ? "invText" : "important"}>{start.format("LT")}</Label>
                </Col>
            );
        },
        [theme]
    );

    return (
        <EventsListGeneric
            navigation={navigation}
            events={eventsByRoom}
            leader={<Section title={room?.Name ?? ""} subtitle={`${eventsByRoom.length} events`} />}
            renderPre={renderPre}
        />
    );
};
