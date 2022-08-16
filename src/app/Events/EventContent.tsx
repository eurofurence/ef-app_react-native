import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import moment from "moment";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Share, StyleSheet } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { BadgeInvPad } from "../../components/Containers/BadgeInvPad";
import { Button } from "../../components/Containers/Button";
import { ImageExButton } from "../../components/Containers/ImageButton";
import { Row } from "../../components/Containers/Row";
import { appBase, conAbbr } from "../../configuration";
import { useTheme } from "../../context/Theme";
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

export const EventContent: FC<EventContentProps> = ({ event, parentPad = 0 }) => {
    const navigation = useAppNavigation("Areas");

    const { t } = useTranslation("Event");
    const { isFavorited, toggleReminder } = useEventReminder(event);
    const theme = useTheme();

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
            {}
        );
    }, [event]);

    return (
        <>
            {!event.SuperSponsorOnly ? null : (
                <BadgeInvPad padding={parentPad} badgeColor={theme.superSponsor} textColor={theme.superSponsorText}>
                    {t("supersponsor_event")}
                </BadgeInvPad>
            )}

            {!event.SponsorOnly ? null : (
                <BadgeInvPad padding={parentPad} badgeColor={theme.sponsor} textColor={theme.sponsorText}>
                    {t("sponsor_event")}
                </BadgeInvPad>
            )}

            <Section icon={isFavorited ? "heart" : event.Glyph} title={event.Title ?? ""} subtitle={event.SubTitle} />
            <Label type="para" mb={20}>
                {event.Abstract}
            </Label>

            {!event.MaskRequired ? null : (
                <Row variant={"center"} style={{ marginBottom: 20 }}>
                    <Icon name={"face-mask"} style={{ flexGrow: 1 }} size={20} color={theme.secondary} />
                    <Label type="para" style={{ flexGrow: 9 }} color={theme.secondary}>
                        {t("mask_required")}
                    </Label>
                </Row>
            )}

            <Row>
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
                          target={{ x: entry.X, y: entry.Y, size: 400 }}
                          onPress={() => navigation.navigate("Map", { id: map.Id, target: link.Target })}
                      />
                  ))}

            <Section icon="information" title={t("label_event_description")} />
            <Label type="para">{event.Description}</Label>
        </>
    );
};

const styles = StyleSheet.create({
    content: {
        paddingVertical: 10,
    },
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
