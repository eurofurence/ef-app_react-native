import moment from "moment";
import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Image } from "react-native";

import { AutoScaleImage } from "../../components/Atoms/AutoScaleImage";
import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { BadgeInvPad } from "../../components/Containers/BadgeInvPad";
import { ImageExButton } from "../../components/Containers/ImageButton";
import { useTheme } from "../../context/Theme";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { DealerWithDetails, mapsCompleteSelectors } from "../../store/eurofurence.selectors";
import { appStyles } from "../AppStyles";

/**
 * Props to the content.
 */
export type DealerContentProps = {
    dealer: DealerWithDetails;

    /**
     * The padding used by the parent horizontally.
     */
    parentPad?: number;
};

export const DealerContent: FC<DealerContentProps> = ({ dealer, parentPad = 0 }) => {
    const navigation = useAppNavigation("Areas");
    const { t } = useTranslation("Dealer");
    const [now] = useNow();
    const theme = useTheme();

    const mapLink = useAppSelector((state) => mapsCompleteSelectors.selectValidLinksByTarget(state, dealer.Id));

    const days = useMemo(
        () =>
            dealer.AttendanceDays
                // Convert to long representation.
                .map((day) => moment(day.Date).format("dddd"))
                // Join comma separated.
                .join(", "),
        [dealer, t]
    );

    // Check if not-attending warning should be marked.
    const markNotAttending = useMemo(() => {
        if (now.day() === 4 && !dealer.AttendsOnThursday) return true;
        else if (now.day() === 5 && !dealer.AttendsOnFriday) return true;
        else if (now.day() === 6 && !dealer.AttendsOnSaturday) return true;
        return false;
    }, [now, dealer]);

    return (
        <>
            {!markNotAttending ? null : (
                <BadgeInvPad padding={parentPad} badgeColor={theme.warning} textColor={theme.invText}>
                    {t("not_attending")}
                </BadgeInvPad>
            )}

            {!dealer.ArtistImageUrl ? null : (
                <View style={[appStyles.shadow, styles.avatarCircle]}>
                    <Image resizeMode="cover" style={styles.avatarImage} source={{ uri: dealer.ArtistImageUrl }} />
                </View>
            )}

            <Section icon="brush" title={dealer.FullName} subtitle={`${dealer.AttendeeNickname} (${dealer.RegistrationNumber})`} />

            <Label type="para">{dealer.ShortDescription}</Label>

            <Section icon="directions-fork" title={t("about")} />
            <Label type="caption">{t("attends")}</Label>
            <Label type="h3" mb={20}>
                {days}
            </Label>

            <Label type="caption">{t("merchandise")}</Label>
            <Label type="h3" mb={20}>
                {dealer.Merchandise}
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

            {mapLink.map(({ map, entry, link }, i) => (
                <ImageExButton
                    key={i}
                    image={map.Image}
                    target={{ x: entry.X, y: entry.Y, size: 400 }}
                    onPress={() => navigation.navigate("Map", { id: map.Id, target: link.Target })}
                />
            ))}

            {!dealer.AboutTheArtText && !dealer.ArtPreviewImageUrl ? null : (
                <>
                    <Section icon="film" title={t("about_the_art")} />

                    {!dealer.ArtPreviewImageUrl ? null : (
                        <View style={styles.imageLine}>
                            <AutoScaleImage style={styles.image} source={dealer.ArtPreviewImageUrl} />

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

                    {!dealer.ArtistImageUrl ? null : (
                        <View style={styles.imageLine}>
                            <AutoScaleImage style={styles.image} source={dealer.ArtistImageUrl} />
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
    imageLine: {
        marginBottom: 20,
        alignItems: "center",
    },
    image: {
        alignSelf: "stretch",
    },
});
