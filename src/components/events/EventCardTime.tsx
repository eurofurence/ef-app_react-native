import moment from "moment/moment";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { getCalendars } from "expo-localization";
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

    useTranslation("Event");

    const zone = moment.tz(getCalendars()[0]?.timeZone ?? conTimeZone).zoneAbbr();

    // Convert event start and duration to readable. Reorder with caution, as
    // local moves the timezones.
    const start = moment.utc(event.StartDateTimeUtc).tz(conTimeZone);
    const duration = moment.duration(event.Duration);
    const time = start.format("LT");
    const day = start.format("ddd");
    const timeLocal = start.local().format("LT");
    const dayLocal = start.local().format("ddd");

    if (type === "duration") {
        const runtime = duration.asMinutes() > 59 ? duration.asHours() + "h" : duration.asMinutes() + "m";
        // Return simple label with duration text.
        return (
            <Col type="center">
                <Label type="caption" color={done ? "important" : "white"}>
                    {timeLocal}
                </Label>
                {time === timeLocal ? null : (
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
                    {timeLocal}
                </Label>
                {time === timeLocal ? null : (
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
