import { Image } from "expo-image";
import { Moment } from "moment/moment";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { isPresent, joinOffDays } from "./utils";
import { useThemeBackground } from "../../hooks/themes/useThemeHooks";
import { DealerDetails } from "../../store/eurofurence.types";
import { appStyles } from "../AppStyles";
import { Label } from "../generic/atoms/Label";

const placeholder = require("../../../assets/images/dealer_black.png");

export type DealerDetailsInstance = {
    details: DealerDetails;
    present: boolean;
    offDays: string;
};

/**
 * Creates the dealer from the time and precomputed values.
 * @param details The details to use.
 * @param now The moment to check against.
 * @param day1 The first day label.
 * @param day2 The second day label.
 * @param day3 The third day label.
 */
export function dealerInstanceForAny(details: DealerDetails, now: Moment, day1: string, day2: string, day3: string) {
    return {
        details,
        present: isPresent(details, now),
        offDays: joinOffDays(details, day1, day2, day3),
    };
}

export type DealerCardProps = {
    dealer: DealerDetailsInstance;
    onPress?: (dealer: DealerDetails) => void;
    onLongPress?: (dealer: DealerDetails) => void;
};

export const DealerCard: FC<DealerCardProps> = ({ dealer, onPress, onLongPress }) => {
    // Details and properties dereference.
    const name = dealer.details.FullName;
    const present = dealer.present;
    const description = dealer.details.Categories?.join(", ");
    const offDays = dealer.offDays;
    const avatar = dealer.details.ArtistThumbnail
        ? dealer.details.ArtistThumbnail.FullUrl
        : dealer.details.Artist
          ? dealer.details.Artist.FullUrl
          : require("../../../assets/images/dealer_black.png");

    // Translation object.
    const { t } = useTranslation("Dealers");

    // Dependent and independent styles.
    const styleContainer = useThemeBackground("background");
    const stylePre = useThemeBackground(present ? "primary" : "darken");

    return (
        <TouchableOpacity style={[styles.container, appStyles.shadow, styleContainer]} onPress={() => onPress?.(dealer.details)} onLongPress={() => onLongPress?.(dealer.details)}>
            <View style={[styles.pre, stylePre]}>
                <Image style={styles.avatarCircle} source={avatar} contentFit="contain" placeholder={placeholder} transition={60} priority="low" />
            </View>

            <View style={styles.main}>
                <Label type="h3">{name}</Label>

                {!description ? null : (
                    <Label type="h4" variant="narrow" ellipsizeMode="tail" numberOfLines={2}>
                        {description}
                    </Label>
                )}

                {!offDays ? null : (
                    <Label style={styles.tag} type="regular" ellipsizeMode="head" numberOfLines={1}>
                        {t("not_attending_on", { offDays })}
                    </Label>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 80,
        marginVertical: 15,
        borderRadius: 16,
        overflow: "hidden",
        flexDirection: "row",
    },
    background: {
        position: "absolute",
        width: undefined,
        height: undefined,
    },
    pre: {
        overflow: "hidden",
        width: 80,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarCircle: {
        position: "absolute",
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    image: {
        position: "absolute",
        width: undefined,
        height: undefined,
        left: -10,
        top: -10,
        right: -10,
        bottom: -10,
    },
    imageOverlay: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    main: {
        flex: 1,
        padding: 12,
    },
    tag: {
        textAlign: "right",
    },
});