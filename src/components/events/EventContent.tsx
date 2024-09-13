import { useIsFocused } from "@react-navigation/core";
import moment from "moment-timezone";
import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { useCalendars } from "expo-localization";
import { captureException } from "@sentry/react-native";
import { useEventReminder } from "../../hooks/events/useEventReminder";
import { useAppNavigation } from "../../hooks/nav/useAppNavigation";
import { useNow } from "../../hooks/time/useNow";
import { shareEvent } from "../../routes/events/Events.common";
import { useAppDispatch, useAppSelector } from "../../store";
import { toggleEventHidden } from "../../store/auxiliary/slice";
import { selectValidLinksByTarget } from "../../store/eurofurence/selectors/maps";
import { EventDetails } from "../../store/eurofurence/types";
import { Banner } from "../generic/atoms/Banner";
import { Label } from "../generic/atoms/Label";
import { MarkdownContent } from "../generic/atoms/MarkdownContent";
import { Progress } from "../generic/atoms/Progress";
import { Section } from "../generic/atoms/Section";
import { Badge } from "../generic/containers/Badge";
import { Button } from "../generic/containers/Button";
import { ImageExButton } from "../generic/containers/ImageButton";
import { Row } from "../generic/containers/Row";
import { conTimeZone } from "../../configuration";

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

    /**
     * True if the event was updated.
     */
    updated?: boolean;

    /**
     * True if a dedicated share button should be displayed.
     */
    shareButton?: boolean;
};

/**
 * Placeholder blur hash.
 */
const placeholder = "L38D%z^%020303D+bv~m%IWF-nIr/1309/667";

export const EventContent: FC<EventContentProps> = ({ event, parentPad = 0, updated, shareButton }) => {
    const navigation = useAppNavigation("Areas");

    const { t } = useTranslation("Event");
    const { isFavorite, toggleReminder } = useEventReminder(event);
    const dispatch = useAppDispatch();
    const isFocused = useIsFocused();
    const now = useNow(isFocused ? 5 : "static");

    const progress = now.diff(moment.utc(event.StartDateTimeUtc)) / moment.utc(event.EndDateTimeUtc).diff(moment.utc(event.StartDateTimeUtc));
    const happening = progress >= 0.0 && progress <= 1.0;
    const feedbackDisabled = progress < 0.0;

    const track = event.ConferenceTrack;
    const room = event.ConferenceRoom;

    const mapLink = useAppSelector((state) => (!room ? undefined : selectValidLinksByTarget(state, room.Id)));

    const calendar = useCalendars();
    const { zone, start, end, day, startLocal, endLocal, dayLocal } = useMemo(() => {
        // Start parsing.
        const zone = moment.tz(calendar[0]?.timeZone ?? conTimeZone).zoneAbbr();
        const eventStart = moment.utc(event.StartDateTimeUtc).tz(conTimeZone);
        const eventEnd = moment.utc(event.EndDateTimeUtc).tz(conTimeZone);

        // Convert event start and duration to readable. Reorder with caution, as
        // local moves the timezones.
        const start = eventStart.format("LT");
        const end = eventEnd.format("LT");
        const day = eventStart.format("ddd");
        const startLocal = eventStart.local().format("LT");
        const endLocal = eventEnd.local().format("LT");
        const dayLocal = eventStart.local().format("ddd");

        return {
            zone,
            start,
            end,
            day,
            startLocal,
            endLocal,
            dayLocal,
        };
    }, [calendar, event.EndDateTimeUtc, event.StartDateTimeUtc]);

    return (
        <>
            {!updated ? null : (
                <Badge unpad={parentPad} badgeColor="warning" textColor="white">
                    {t("event_was_updated")}
                </Badge>
            )}

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
                    <Banner image={event.Poster} placeholder={placeholder} viewable />
                </View>
            )}

            <Section icon={isFavorite ? "heart" : event.Glyph} title={event.Title ?? ""} subtitle={event.SubTitle} />
            {!happening ? null : <Progress value={progress} />}
            <MarkdownContent defaultType="para" mb={20}>
                {event.Abstract}
            </MarkdownContent>

            {!event.MaskRequired ? null : (
                <Badge unpad={parentPad} icon="face-mask" textColor="secondary" textType="regular" textVariant="regular">
                    {t("mask_required")}
                </Badge>
            )}

            {!shareButton ? null : (
                <Button icon="share" onPress={() => shareEvent(event)}>
                    {t("share")}
                </Button>
            )}

            <Row style={styles.marginBefore}>
                <Button
                    containerStyle={styles.rowLeft}
                    outline={isFavorite}
                    icon={isFavorite ? "heart-minus" : "heart-plus-outline"}
                    onPress={() => toggleReminder().catch(captureException)}
                >
                    {isFavorite ? t("remove_favorite") : t("add_favorite")}
                </Button>
                <Button containerStyle={styles.rowRight} icon={event.Hidden ? "eye" : "eye-off"} onPress={() => dispatch(toggleEventHidden(event.Id))} outline>
                    {event.Hidden ? t("reveal") : t("hide")}
                </Button>
            </Row>

            {event.IsAcceptingFeedback && (
                <Button disabled={feedbackDisabled} containerStyle={styles.marginBefore} icon="pencil" onPress={() => navigation.navigate("EventFeedback", { id: event.Id })}>
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
                {t("when", {
                    day: day,
                    start: start,
                    finish: end,
                })}
                {start === startLocal ? null : (
                    <Label type="bold">
                        {" " +
                            t("when_local", {
                                day: dayLocal,
                                start: startLocal,
                                finish: endLocal,
                                zone: zone,
                            })}
                    </Label>
                )}
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
    marginBefore: {
        marginTop: 15,
    },
    posterLine: {
        marginTop: 20,
        alignItems: "center",
    },
});
