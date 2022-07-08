import moment from "moment";
import { FC } from "react";
import { StyleSheet } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { Button } from "../../components/Containers/Button";
import { Row } from "../../components/Containers/Row";
import { EventDayRecord, EventRecord, EventRoomRecord, EventTrackRecord } from "../../store/eurofurence.types";

export interface EventContentProps {
    isFavorited?: boolean;
    event: EventRecord;
    day?: EventDayRecord;
    track?: EventTrackRecord;
    room?: EventRoomRecord;
}

export const EventContent: FC<EventContentProps> = ({ isFavorited, event, day, track, room }) => {
    return (
        <>
            <Section icon={isFavorited ? "heart" : "calendar"} title={event.Title ?? ""} subtitle={event.SubTitle} />
            <Label type="para" mb={20}>
                {event.Abstract}
            </Label>

            <Row>
                <Button containerStyle={styles.rowLeft} outline={isFavorited} icon={isFavorited ? "heart-outline" : "heart"}>
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
                {!day ? null : `${moment(day.Date).format("dddd")}, `}
                {moment(event.StartDateTimeUtc).format("hh:mm")} until {moment(event.EndDateTimeUtc).format("hh:mm")}
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
