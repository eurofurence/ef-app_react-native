import * as Linking from "expo-linking";
import moment from "moment";
import React, { FC, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { dealerShowAttendee } from "../../configuration";
import { useAppNavigation } from "../../hooks/nav/useAppNavigation";
import { useNow } from "../../hooks/time/useNow";
import { shareDealer } from "../../routes/dealers/DealerItem";
import { useAppDispatch, useAppSelector } from "../../store";
import { toggleDealerFavorite } from "../../store/auxiliary/slice";
import { selectValidLinksByTarget } from "../../store/eurofurence/selectors/maps";
import { DealerDetails } from "../../store/eurofurence/types";
import { appStyles } from "../AppStyles";
import { Banner } from "../generic/atoms/Banner";
import { FaIcon } from "../generic/atoms/FaIcon";
import { Image } from "../generic/atoms/Image";
import { Label } from "../generic/atoms/Label";
import { Section } from "../generic/atoms/Section";
import { Badge } from "../generic/containers/Badge";
import { Button } from "../generic/containers/Button";
import { ImageExButton } from "../generic/containers/ImageButton";
import { LinkItem } from "../maps/LinkItem";

/**
 * Props to the content.
 */
export type DealerContentProps = {
    dealer: DealerDetails;

    /**
     * The padding used by the parent horizontally.
     */
    parentPad?: number;

    /**
     * True if the dealer was updated.
     */
    updated?: boolean;

    /**
     * True if a dedicated share button should be displayed.
     */
    shareButton?: boolean;
};

export const DealerContent: FC<DealerContentProps> = ({ dealer, parentPad = 0, updated, shareButton }) => {
    const navigation = useAppNavigation("Areas");
    const { t } = useTranslation("Dealer");
    const now = useNow();

    const dispatch = useAppDispatch();
    const mapLink = useAppSelector((state) => selectValidLinksByTarget(state, dealer.Id));

    const toggleFavorite = useCallback(() => dispatch(toggleDealerFavorite(dealer.Id)), [dispatch, dealer.Id]);

    const days = useMemo(
        () =>
            dealer.AttendanceDays
                // Convert to long representation.
                .map((day) => moment(day.Date).format("dddd"))
                // Join comma separated.
                .join(", "),
        [dealer, t],
    );

    // Check if not-attending warning should be marked.
    const markNotAttending = useMemo(() => {
        if (now.day() === 1 && !dealer.AttendsOnThursday) return true;
        else if (now.day() === 2 && !dealer.AttendsOnFriday) return true;
        else if (now.day() === 3 && !dealer.AttendsOnSaturday) return true;
        return false;
    }, [now, dealer]);

    return (
        <>
            {!updated ? null : (
                <Badge unpad={parentPad} badgeColor="warning" textColor="white">
                    {t("dealer_was_updated")}
                </Badge>
            )}

            {!markNotAttending ? null : (
                <Badge unpad={parentPad} badgeColor="warning" textColor="invText">
                    {t("not_attending")}
                </Badge>
            )}

            {!dealer.Artist ? null : (
                <View style={[appStyles.shadow, styles.avatarCircle]}>
                    <Image contentFit="cover" style={styles.avatarImage} source={dealer.Artist.FullUrl} />
                </View>
            )}

            {dealerShowAttendee ? (
                <Section icon="brush" title={dealer.FullName} subtitle={`${dealer.AttendeeNickname} (${dealer.RegistrationNumber})`} />
            ) : (
                <Section icon="brush" title={dealer.FullName} />
            )}

            <Label type="para">{dealer.ShortDescriptionContent}</Label>

            <Button containerStyle={styles.marginBefore} outline={dealer.Favorite} icon={dealer.Favorite ? "heart-outline" : "heart"} onPress={toggleFavorite}>
                {dealer.Favorite ? t("remove_favorite") : t("add_favorite")}
            </Button>

            {!shareButton ? null : (
                <Button containerStyle={styles.marginBefore} icon="share" onPress={() => shareDealer(dealer)}>
                    {t("share")}
                </Button>
            )}

            <Section icon="directions-fork" title={t("about")} />
            <Label type="caption">{t("table")}</Label>
            {!dealer.ShortDescriptionTable ? null : (
                <Label type="h3" mb={20}>
                    {dealer.ShortDescriptionTable}
                </Label>
            )}

            <Label type="caption">{t("attends")}</Label>
            <Label type="h3" mb={20}>
                {days}
            </Label>

            {!dealer.IsAfterDark ? null : (
                <>
                    <Label type="caption">{t("after_dark")}</Label>
                    <Label type="h3" mb={20}>
                        {t("in_after_dark")}
                    </Label>
                </>
            )}

            {!dealer.Categories?.length ? null : (
                <>
                    <Label type="caption">{t("categories")}</Label>
                    <Label type="h3" mb={20}>
                        {dealer.Categories?.join(", ")}
                    </Label>
                </>
            )}
            {dealer.Links &&
                dealer.Links.map((it) => (
                    <View style={styles.button} key={it.Name}>
                        <LinkItem link={it} />
                    </View>
                ))}

            {dealer.TelegramHandle && (
                <Button
                    containerStyle={styles.button}
                    onPress={() => Linking.openURL(`https://t.me/${dealer.TelegramHandle}`)}
                    icon={(props) => <FaIcon name="telegram-plane" {...props} />}
                >
                    Telegram: {dealer.TelegramHandle}
                </Button>
            )}
            {dealer.TwitterHandle && (
                <Button containerStyle={styles.button} onPress={() => Linking.openURL(`https://twitter.com/${dealer.TwitterHandle}`)} icon="twitter">
                    Twitter: {dealer.TwitterHandle}
                </Button>
            )}

            {mapLink.map(({ map, entry, link }, i) => (
                <ImageExButton
                    key={i}
                    image={map.Image}
                    target={{ x: entry.X, y: entry.Y, size: entry.TapRadius * 10 }}
                    onPress={() => navigation.navigate("Map", { id: map.Id, entryId: entry.Id, linkId: entry.Links.indexOf(link) })}
                />
            ))}

            {!dealer.AboutTheArtText && !dealer.ArtPreview ? null : (
                <>
                    <Section icon="film" title={t("about_the_art")} />

                    {!dealer.ArtPreview ? null : (
                        <View style={styles.posterLine}>
                            <Banner image={dealer.ArtPreview} viewable />

                            <Label mt={10} type="caption" numberOfLines={4} ellipsizeMode="tail">
                                {dealer.ArtPreviewCaption}
                            </Label>
                        </View>
                    )}

                    <Label type="para">{dealer.AboutTheArtText}</Label>
                </>
            )}

            {!dealer.AboutTheArtistText && !dealer.ArtistImageId ? null : (
                <>
                    <Section icon="account-circle-outline" title={t("about_the_artist", { name: dealer.FullName })} />

                    {!dealer.Artist ? null : (
                        <View style={styles.posterLine}>
                            <Banner image={dealer.Artist} viewable />
                        </View>
                    )}

                    <Label type="para">{dealer.AboutTheArtistText}</Label>
                </>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    avatarCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: "hidden",
        alignSelf: "center",
        margin: 20,
    },
    avatarImage: {
        width: "100%",
        height: "100%",
    },
    aboutLine: {
        marginBottom: 20,
    },
    posterLine: {
        marginBottom: 20,
        alignItems: "center",
    },
    marginBefore: {
        marginTop: 15,
    },
    button: {
        marginBottom: 20,
    },
});
