import moment from "moment";
import React, { FC, useMemo } from "react";
import { ImageSourcePropType } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { Col } from "../../components/Containers/Col";
import { useTheme } from "../../context/Theme";
import { useEventIsDone, useEventIsHappening } from "../../hooks/useEventProperties";
import { createImageUrl } from "../../store/eurofurence.enrichers";
import { EventWithDetails } from "../../store/eurofurence.selectors";
import { EventRecord } from "../../store/eurofurence.types";
import { EventCardContent } from "./EventCardContent";

export type EventCardProps = {
    type?: "duration" | "time";
    event: EventWithDetails;
    onPress?: () => void;
    onLongPress?: () => void;
};

export const EventCard: FC<EventCardProps> = ({ type = "duration", event, onPress, onLongPress }) => {
    const theme = useTheme();

    // Resolve event statuses.
    const happening = useEventIsHappening(event);
    const done = useEventIsDone(event);

    // Renders the override or default. The override will receive if it needs to
    // render on inverted color, i.e., background.
    const pre = useMemo(() => {
        if (type === "duration") {
            // Convert event duration to readable.
            const duration = moment.duration(event.Duration);
            const durationText = duration.asMinutes() > 59 ? duration.asHours() + "h" : duration.asMinutes() + "m";

            // Return simple label with duration text.
            return (
                <Label style={{ color: done ? theme.important : theme.invText }} type="h2">
                    {durationText}
                </Label>
            );
        } else {
            const start = moment(event.StartDateTimeUtc);
            return (
                <Col type="center">
                    <Label type="caption" color={done ? "important" : "invText"}>
                        {start.format("ddd")}
                    </Label>
                    <Label color={done ? "important" : "invText"}>{start.format("LT")}</Label>
                </Col>
            );
        }
    }, [type, event, done, theme]);

    return (
        <EventCardContent
            key={event.Id}
            background={eventBanner(event)}
            pre={pre}
            title={event.Title}
            subtitle={event.ConferenceRoom?.Name}
            tag={event.PanelHosts}
            happening={happening}
            done={done}
            onPress={onPress}
            onLongPress={onLongPress}
        />
    );
};

// TODO: Plase see if we will have an enriched format here too.

const eventBanner = (event: EventRecord): ImageSourcePropType | undefined => (event.BannerImageId ? { uri: createImageUrl(event.BannerImageId) } : undefined);
