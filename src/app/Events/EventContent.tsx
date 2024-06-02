import { captureException } from "@sentry/react-native";
import moment from "moment";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Share, StyleSheet, View } from "react-native";

import { Banner } from "../../components/Atoms/Banner";
import { Label } from "../../components/Atoms/Label";
import { MarkdownContent } from "../../components/Atoms/MarkdownContent";
import { Section } from "../../components/Atoms/Section";
import { Badge } from "../../components/Containers/Badge";
import { Button } from "../../components/Containers/Button";
import { ImageExButton } from "../../components/Containers/ImageButton";
import { Row } from "../../components/Containers/Row";
import { appBase, conAbbr } from "../../configuration";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useEventReminder } from "../../hooks/useEventReminder";
import { useAppSelector } from "../../store";
import { selectValidLinksByTarget } from "../../store/eurofurence.selectors";
import { EventDetails } from "../../store/eurofurence.types";

/**
 * Props to the content.
 */
export type EventContentProps = {
    /**
     * The event to display.
     */
    event: EventDetails;

    /**
     * The padding used by the parent horizontally.
     */
    parentPad?: number;
};

/**
 * Placeholder blur hash.
 */
const placeholder = "m38D%z^%020303D+bv~m%IWF-nIrRS-mxsobE3E4f+W;s:%0oIRk";

export const EventContent: FC<EventContentProps> = ({ event, parentPad = 0 }) => {
    const navigation = useAppNavigation("Areas");

    const { t } = useTranslation("Event");
    const { isFavorited, toggleReminder } = useEventReminder(event);

    const day = event.ConferenceDay;
    const track = event.ConferenceTrack;
    const room = event.ConferenceRoom;

    const mapLink = useAppSelector((state) => (!room ? undefined : selectValidLinksByTarget(state, room.Id)));

    const shareEvent = useCallback(() => {
        Share.share(
            {
                title: event.Title,
                url: `${appBase}/Web/Events/${event.Id}`,
                message: `Check out ${event.Title} on ${conAbbr}!\n${appBase}/Web/Events/${event.Id}`,
            },
            {},
        ).catch(captureException);
    }, [event]);

    return (
        <>
            {!event.SuperSponsorOnly ? null : (
                <Badge unpad={parentPad} badgeColor="superSponsor" textColor="superSponsorText">
                    {t("supersponsor_event")}
                </Badge>
            )}

            {!event.SponsorOnly ? null : (
                <Badge unpad={parentPad} badgeColor="sponsor" textColor="sponsorText">
                    {t("sponsor_event")}
                </Badge>
            )}

            {!event.Poster ? null : (
                <View style={styles.posterLine}>
                    <Banner image={event.Poster} placeholder={placeholder} />
                </View>
            )}

            <Section icon={isFavorited ? "heart" : event.Glyph} title={event.Title ?? ""} subtitle={event.SubTitle} />
            <MarkdownContent defaultType="para" mb={20}>
                {event.Abstract}
            </MarkdownContent>

            {!event.MaskRequired ? null : (
                <Badge unpad={parentPad} icon="face-mask" textColor="secondary" textType="regular" textVariant="regular">
                    {t("mask_required")}
                </Badge>
            )}

            <Row style={styles.marginBefore}>
                <Button style={styles.rowLeft} outline={isFavorited} icon={isFavorited ? "heart-outline" : "heart"} onPress={toggleReminder}>
                    {isFavorited ? t("remove_favorite") : t("add_favorite")}
                </Button>
                <Button style={styles.rowRight} icon={"share"} onPress={shareEvent}>
                    {t("share")}
                </Button>
            </Row>

            {event.IsAcceptingFeedback && (
                <Button style={styles.share} icon="pencil" onPress={() => navigation.navigate("EventFeedback", { id: event.Id })}>
                    {t("give_feedback")}
                </Button>
            )}

            <Section icon="directions-fork" title={t("about_title")} />
            <Label type="caption">{t("label_event_panelhosts")}</Label>
            <Label type="h3" mb={20}>
                {event.PanelHosts}
            </Label>

            <Label type="caption">{t("label_event_when")}</Label>
            <Label type="h3" mb={20}>
                {t("when", { day: day && moment(day.Date).format("dddd"), start: moment(event.StartDateTimeUtc).format("LT"), finish: moment(event.EndDateTimeUtc).format("LT") })}
            </Label>

            <Label type="caption">{t("label_event_track")}</Label>
            <Label type="h3" mb={20}>
                {track?.Name || " "}
            </Label>

            <Label type="caption">{t("label_event_room")}</Label>
            <Label type="h3" mb={20}>
                {room?.Name || " "}
            </Label>

            {!mapLink
                ? null
                : mapLink.map(({ map, entry, link }, i) => (
                      <ImageExButton
                          key={i}
                          image={map.Image}
                          target={{ x: entry.X, y: entry.Y, size: entry.TapRadius * 10 }}
                          onPress={() => navigation.navigate("Map", { id: map.Id, entryId: entry.Id, linkId: entry.Links.indexOf(link) })}
                      />
                  ))}

            <Section icon="information" title={t("label_event_description")} />
            <MarkdownContent defaultType="para">{event.Description}</MarkdownContent>
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
    marginBefore: {
        marginTop: 20,
    },
    posterLine: {
        marginTop: 20,
        alignItems: "center",
    },
});
