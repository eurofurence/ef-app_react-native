import moment from "moment";
import React, { FC, ReactNode, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { EventCardContent } from "./EventCardContent";
import { Label } from "../../components/Atoms/Label";
import { Col } from "../../components/Containers/Col";
import { useEventIsDone, useEventIsHappening } from "../../hooks/events/useEventProperties";
import { EventDetails } from "../../store/eurofurence.types";

export type EventCardProps = {
    type?: "duration" | "time";
    event: EventDetails;
    onPress?: (event: EventDetails) => void;
    onLongPress?: (event: EventDetails) => void;
};

export const EventCard: FC<EventCardProps> = ({ type = "duration", event, onPress, onLongPress }) => {
    const { t } = useTranslation("Event");

    // Resolve event statuses.
    const happening = useEventIsHappening(event);
    const done = useEventIsDone(event);

    // Renders the override or default. The override will receive if it needs to
    // render on inverted color, i.e., background.
    const pre = useMemo<ReactNode>(() => {
        // Convert event start and duration to readable.
        const start = moment(event.StartDateTimeUtc);
        const duration = moment.duration(event.Duration);

        const day = start.format("ddd");
        const time = start.format("LT");
        const runtime = duration.asMinutes() > 59 ? duration.asHours() + "h" : duration.asMinutes() + "m";

        if (type === "duration") {
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
            return (
                <Col type="center">
                    <Label type="caption" color={done ? "important" : "white"}>
                        {time}
                    </Label>
                    <Label color={done ? "important" : "white"}>{day}</Label>
                </Col>
            );
        }
    }, [t, type, event, done]);

    // Convert to poster source.
    const poster = useMemo(() => (event.Banner ? { uri: event.Banner.FullUrl } : undefined), [event]);

    // Wrap delegates.
    const onPressDelegate = useCallback(() => onPress?.(event), [onPress, event]);
    const onLongPressDelegate = useCallback(() => onLongPress?.(event), [onLongPress, event]);

    return (
        <EventCardContent
            badges={event.Badges}
            glyph={event.Glyph}
            pre={pre}
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
