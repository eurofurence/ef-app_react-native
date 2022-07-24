import moment from "moment";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Share, StyleSheet } from "react-native";
import MarkdownView from "react-native-showdown";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { Button } from "../../components/Containers/Button";
import { ImageExButton } from "../../components/Containers/ImageButton";
import { Row } from "../../components/Containers/Row";
import { appBase, conAbbr } from "../../configuration";
import { useEventReminder } from "../../hooks/useEventReminder";
import { useAppSelector } from "../../store";
import { EventWithDetails, mapsCompleteSelectors } from "../../store/eurofurence.selectors";

/**
 * Props to the content.
 */
export type EventContentProps = {
    /**
     * True if favorited. TODO: This should not be given fixed but resolved and changable.
     */
    isFavorited?: boolean;

    /**
     * The event to display.
     */
    event: EventWithDetails;
};

export const EventContent: FC<EventContentProps> = ({ event }) => {
    const { t } = useTranslation("Event");
    const { isFavorited, toggleReminder } = useEventReminder(event);

    const day = event.ConferenceDay;
    const track = event.ConferenceTrack;
    const room = event.ConferenceRoom;

    const mapLink = useAppSelector((state) => mapsCompleteSelectors.selectValidLinksByTarget(state, room.Id));

    const shareEvent = useCallback(() => {
        Share.share(
            {
                title: event.Title,
                url: `${appBase}/Web/Events/${event.Id}`,
                message: `Check out ${event.Title} on ${conAbbr}!\n${appBase}/Web/Events/${event.Id}`,
            },
            {}
        );
    }, [event]);

    return (
        <>
            <Section icon={isFavorited ? "heart" : "calendar"} title={event.Title ?? ""} subtitle={event.SubTitle} />
            <Label type="para" mb={20}>
                {event.Abstract}
            </Label>

            <Row>
                <Button style={styles.rowLeft} outline={isFavorited} icon={isFavorited ? "heart-outline" : "heart"} onPress={toggleReminder}>
                    {isFavorited ? "Unfavorite" : "Favorite"}
                </Button>
                <Button style={styles.rowRight} icon="pencil">
                    Give feedback
                </Button>
            </Row>

            <Button style={styles.share} icon={"share"} onPress={shareEvent}>
                Share this event
            </Button>

            <Section icon="directions-fork" title="About" />
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

            {mapLink.map(({ map, entry }, i) => (
                <ImageExButton key={i} image={map.Image} target={{ x: entry.X, y: entry.Y, size: 400 }}>
                    {t("view_on_map")}
                </ImageExButton>
            ))}

            <Section icon="information" title="More about the event" />
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
    share: {
        marginVertical: 15,
    },
});
