import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, Image } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { Scroller } from "../../components/Containers/Scroller";
import { EnrichedDealerRecord } from "../../store/eurofurence.types";
import { appStyles } from "../AppStyles";

/**
 * Props to the content.
 */
export type DealerContentProps = {
    dealer: EnrichedDealerRecord;
};

export const DealerContent: FC<DealerContentProps> = ({ dealer }) => {
    const { t } = useTranslation("Dealers");

    const dealerDays = useMemo(() => {
        const result = [];
        if (dealer.AttendsOnThursday) result.push(t("attends_thu"));
        if (dealer.AttendsOnFriday) result.push(t("attends_fri"));
        if (dealer.AttendsOnSaturday) result.push(t("attends_sat"));
        return result.join(", ");
    }, [dealer, t]);
    return (
        <Scroller>
            {!dealer.ArtistImageUrl ? null : (
                <View style={[appStyles.shadow, styles.avatar]}>
                    <Image resizeMode="cover" style={styles.avatarImage} source={{ uri: dealer.ArtistImageUrl }} />
                </View>
            )}

            <Section icon="brush" title={dealer.DisplayName} subtitle={`${dealer.AttendeeNickname} (${dealer.RegistrationNumber})`} />
            <Label type="para">{dealer.ShortDescription}</Label>

            <Section icon="git-merge" title="About" />
            <Label type="caption">Attends on</Label>
            <Label type="h3" mb={20}>
                {dealerDays}
            </Label>

            <Label type="caption">Merchandise</Label>
            <Label type="h3" mb={20}>
                {dealer.Merchandise}
            </Label>

            {!dealer.IsAfterDark ? null : (
                <>
                    <Label type="caption">After dark</Label>
                    <Label type="h3" mb={20}>
                        Located in the after dark section
                    </Label>
                </>
            )}

            {!dealer.Categories?.length ? null : (
                <>
                    <Label type="caption">Categories</Label>
                    <Label type="h3" mb={20}>
                        {dealer.Categories?.join(", ")}
                    </Label>
                </>
            )}

            {!dealer.AboutTheArtText && !dealer.ArtPreviewImageUrl ? null : (
                <>
                    <Section icon="film" title="About the art" />

                    {!dealer.ArtPreviewImageUrl ? null : (
                        <View style={styles.imageLine}>
                            <Image resizeMode="contain" style={styles.image} source={{ uri: dealer.ArtPreviewImageUrl }} />

                            <Label type="caption" numberOfLines={4} ellipsizeMode="tail">
                                {dealer.ArtPreviewCaption}
                            </Label>
                        </View>
                    )}

                    <Label type="para">{dealer.AboutTheArtText}</Label>
                </>
            )}

            {!dealer.AboutTheArtistText && !dealer.ArtistImageId ? null : (
                <>
                    <Section icon="person-circle-outline" title="About the artist" />

                    {!dealer.ArtistImageUrl ? null : (
                        <View style={styles.imageLine}>
                            <Image resizeMode="contain" style={styles.image} source={{ uri: dealer.ArtistImageUrl }} />
                        </View>
                    )}

                    <Label type="para">{dealer.AboutTheArtistText}</Label>
                </>
            )}
        </Scroller>
    );
};

const styles = StyleSheet.create({
    avatar: {
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
        width: "100%",
        aspectRatio: 1,
        marginBottom: 20,
    },
});
