import moment from "moment/moment";
import React, { FC, useMemo } from "react";

import { useCalendars } from "expo-localization";
import { EventDetails } from "../../store/eurofurence/types";
import { Label } from "../generic/atoms/Label";
import { Col } from "../generic/containers/Col";
import { conTimeZone } from "../../configuration";

export type EventCardTimeProps = {
    type?: "duration" | "time";
    event: EventDetails;
    done: boolean;
};

export const EventCardTime: FC<EventCardTimeProps> = ({ type, event, done }) => {
    // Renders the override or default. The override will receive if it needs to
    // render on inverted color, i.e., background.

    const calendar = useCalendars();
    const { zone, runtime, start, day, startLocal, dayLocal } = useMemo(() => {
        // Start parsing.
        const zone = moment.tz(calendar[0]?.timeZone ?? conTimeZone).zoneAbbr();
        const eventStart = moment.utc(event.StartDateTimeUtc).tz(conTimeZone);

        // Convert event start and duration to readable. Reorder with caution, as
        // local moves the timezones.
        const start = eventStart.format("LT");
        const day = eventStart.format("ddd");
        const startLocal = eventStart.local().format("LT");
        const dayLocal = eventStart.local().format("ddd");

        // Duration conversion.
        const duration = moment.duration(event.Duration);
        const runtime = duration.asMinutes() > 59 ? duration.asHours() + "h" : duration.asMinutes() + "m";

        return {
            zone,
            runtime,
            start,
            day,
            startLocal,
            dayLocal,
        };
    }, [calendar, event.Duration, event.StartDateTimeUtc]);

    if (type === "duration") {
        // Return simple label with duration text.
        return (
            <Col type="center">
                <Label type="caption" color={done ? "important" : "white"}>
                    {startLocal}
                </Label>
                {start === startLocal ? null : (
                    <Label type="minor" color={done ? "important" : "white"}>
                        {zone}
                        {day === dayLocal ? null : (
                            <Label type="minor" color={done ? "important" : "white"}>
                                , {dayLocal}
                            </Label>
                        )}
                    </Label>
                )}
                <Label color={done ? "important" : "white"}>{runtime}</Label>
            </Col>
        );
    } else {
        return (
            <Col type="center">
                <Label type="caption" color={done ? "important" : "white"}>
                    {startLocal}
                </Label>
                {start === startLocal ? null : (
                    <Label type="minor" color={done ? "important" : "white"}>
                        {zone}
                        {day === dayLocal ? null : (
                            <Label type="minor" color={done ? "important" : "white"}>
                                , {dayLocal}
                            </Label>
                        )}
                    </Label>
                )}
                <Label color={done ? "important" : "white"}>{day}</Label>
            </Col>
        );
    }
};
