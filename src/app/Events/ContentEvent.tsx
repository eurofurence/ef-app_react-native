import moment from "moment";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { Button } from "../../components/Containers/Button";
import { Row } from "../../components/Containers/Row";
import { useEventReminder } from "../../hooks/useEventReminder";
import { EventDayRecord, EventRecord, EventRoomRecord, EventTrackRecord } from "../../store/eurofurence.types";

/**
 * Props to the content.
 */
export type ContentEventProps = {
    /**
     * True if favorited. TODO: This should not be given fixed but resolved and changable.
     */
    isFavorited?: boolean;

    /**
     * The event to display.
     */
    event: EventRecord;

    /**
     * The day if present, will not be resolved on load.
     */
    day?: EventDayRecord;

    /**
     * The track if present, will not be resolved on load.
     */
    track?: EventTrackRecord;

    /**
     * The room if present, will not be resolved on load.
     */
    room?: EventRoomRecord;
};

export const ContentEvent: FC<ContentEventProps> = ({ event, day, track, room }) => {
    const { t } = useTranslation("Events");
    const { isFavorited, toggleReminder } = useEventReminder(event);
    return (
        <>
            <Section icon={isFavorited ? "heart" : "calendar"} title={event.Title ?? ""} subtitle={event.SubTitle} />
            <Label type="para" mb={20}>
                {event.Abstract}
            </Label>

            <Row>
                <Button containerStyle={styles.rowLeft} outline={isFavorited} icon={isFavorited ? "heart-outline" : "heart"} onPress={toggleReminder}>
                    {isFavorited ? "Unfavorite" : "Favorite"}
                </Button>
                <Button containerStyle={styles.rowRight} icon="pencil">
                    Give feedback
                </Button>
            </Row>

            <Section icon="git-merge" title="About" />
            <Label type="caption">Hosted by</Label>
            <Label type="h3" mb={20}>
                {event.PanelHosts}
            </Label>

            <Label type="caption">When</Label>
            <Label type="h3" mb={20}>
                {t("when", { day: day && moment(day.Date).format("dddd"), start: moment(event.StartDateTimeUtc).format("LT"), finish: moment(event.EndDateTimeUtc).format("LT") })}
            </Label>

            <Label type="caption">Track</Label>
            <Label type="h3" mb={20}>
                {track?.Name || " "}
            </Label>

            <Label type="caption">Room</Label>
            <Label type="h3" mb={20}>
                {room?.Name || " "}
            </Label>

            <Section icon="information-circle" title="More about the event" />
            <Label type="para">{event.Description}</Label>
        </>
    );
};

const styles = StyleSheet.create({
    rowLeft: {
        flex: 1,
        marginRight: 8,
    },
    rowRight: {
        flex: 1,
        marginLeft: 8,
    },
});
