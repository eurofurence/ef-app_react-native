import moment from "moment/moment";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import { EventDetails } from "../../../store/eurofurence.types";
import { Label } from "../../generic/atoms/Label";
import { Col } from "../../generic/containers/Col";

export type EventCardTimeProps = {
    type?: "duration" | "time";
    event: EventDetails;
    done: boolean;
};

export const EventCardTime: FC<EventCardTimeProps> = ({ type, event, done }) => {
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
