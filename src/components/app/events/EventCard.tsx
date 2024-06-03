import moment from "moment";
import React, { FC, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { EventCardContent } from "./EventCardContent";
import { useEventIsDone, useEventIsHappening } from "../../../hooks/events/useEventProperties";
import { EventDetails } from "../../../store/eurofurence.types";
import { Label } from "../../generic/atoms/Label";
import { Col } from "../../generic/containers/Col";

export type EventCardPreProps = {
    type?: "duration" | "time";
    event: EventDetails;
    done: boolean;
};

const EventCardPre: FC<EventCardPreProps> = ({ type, event, done }) => {
    // Renders the override or default. The override will receive if it needs to
    // render on inverted color, i.e., background.

    useTranslation("Event");

    // Convert event start and duration to readable.
    const start = moment(event.StartDateTimeUtc);
    const duration = moment.duration(event.Duration);
    const time = start.format("LT");

    if (type === "duration") {
        const runtime = duration.asMinutes() > 59 ? duration.asHours() + "h" : duration.asMinutes() + "m";
        // Return simple label with duration text.
        return (
            <Col type="center">
                <Label type="caption" color={done ? "important" : "white"}>
                    {time}
                </Label>
                <Label color={done ? "important" : "white"}>{runtime}</Label>
            </Col>
        );
    } else {
        const day = start.format("ddd");
        return (
            <Col type="center">
                <Label type="caption" color={done ? "important" : "white"}>
                    {time}
                </Label>
                <Label color={done ? "important" : "white"}>{day}</Label>
            </Col>
        );
    }
};

export type EventCardProps = {
    type?: "duration" | "time";
    event: EventDetails;
    onPress?: (event: EventDetails) => void;
    onLongPress?: (event: EventDetails) => void;
};

export const EventCard: FC<EventCardProps> = ({ type = "duration", event, onPress, onLongPress }) => {
    // Resolve event statuses.
    const happening = useEventIsHappening(event);
    const done = useEventIsDone(event);

    // Convert to poster source.
    const poster = useMemo(() => (event.Banner ? { uri: event.Banner.FullUrl } : undefined), [event]);

    // Wrap delegates.
    const onPressDelegate = useCallback(() => onPress?.(event), [onPress, event]);
    const onLongPressDelegate = useCallback(() => onLongPress?.(event), [onLongPress, event]);

    return (
        <EventCardContent
            badges={event.Badges}
            glyph={event.Glyph}
            pre={<EventCardPre type={type} event={event} done={done} />}
            poster={poster}
            title={event.Title}
            subtitle={event.SubTitle}
            tag={event.ConferenceRoom?.ShortName ?? event.ConferenceRoom?.Name}
            happening={happening}
            done={done}
            onPress={onPressDelegate}
            onLongPress={onLongPressDelegate}
        />
    );
};
