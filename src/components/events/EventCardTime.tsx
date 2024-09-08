import React, { FC } from "react";

import { Label } from "../generic/atoms/Label";
import { Col } from "../generic/containers/Col";
import { EventDetailsInstance } from "./EventCard";

export type EventCardTimeProps = {
    type?: "duration" | "time";
    event: EventDetailsInstance;
    done: boolean;
    zone: string;
};

export const EventCardTime: FC<EventCardTimeProps> = ({ type, event, done, zone }) => {
    const textColor = done ? "important" : "white";
    if (type === "duration") {
        // Return simple label with duration text.
        return (
            <Col type="center">
                <Label key="startLocal" type="caption" color={textColor}>
                    {event.startLocal}
                </Label>
                {event.start === event.startLocal ? null : (
                    <Label key="zoneInfo" type="minor" color={textColor}>
                        {zone}
                        {event.day === event.dayLocal ? null : (
                            <Label key="zoneDayInfo" type="minor" color={textColor}>
                                , {event.dayLocal}
                            </Label>
                        )}
                    </Label>
                )}
                <Label color={textColor}>{event.runtime}</Label>
            </Col>
        );
    } else {
        return (
            <Col type="center">
                <Label key="startLocal" type="caption" color={textColor}>
                    {event.startLocal}
                </Label>
                {event.start === event.startLocal ? null : (
                    <Label key="zoneInfo" type="minor" color={textColor}>
                        {zone}
                        {event.day === event.dayLocal ? null : (
                            <Label key="zoneDayInfo" type="minor" color={textColor}>
                                , {event.dayLocal}
                            </Label>
                        )}
                    </Label>
                )}
                <Label color={textColor}>{event.day}</Label>
            </Col>
        );
    }
};
