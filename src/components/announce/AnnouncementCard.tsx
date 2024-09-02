import { ImageBackground } from "expo-image";
import moment, { Moment } from "moment";
import React, { FC } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useThemeBackground, useThemeName } from "../../hooks/themes/useThemeHooks";
import { AnnouncementDetails } from "../../store/eurofurence/types";
import { appStyles } from "../AppStyles";
import { Label } from "../generic/atoms/Label";
import { colorForArea } from "./utils";

export type AnnouncementDetailsInstance = {
    details: AnnouncementDetails;
    time: string;
};

/**
 * Creates the announcement instance props for an upcoming or running announcement.
 * @param details The details to use.
 * @param now The moment to check against.
 */
export function announcementInstanceForAny(details: AnnouncementDetails, now: Moment): AnnouncementDetailsInstance {
    return { details, time: moment.duration(moment(details.ValidFromDateTimeUtc).diff(now)).humanize(true) };
}

export type AnnouncementCardProps = {
    containerStyle?: ViewStyle;
    style?: ViewStyle;
    announcement: AnnouncementDetailsInstance;
    onPress?: (announcement: AnnouncementDetails) => void;
    onLongPress?: (announcement: AnnouncementDetails) => void;
};

export const AnnouncementCard: FC<AnnouncementCardProps> = ({ containerStyle, style, announcement, onPress, onLongPress }) => {
    // Dependent and independent styles.
    const styleContainer = useThemeBackground("background");
    const saturationValue = useThemeName() === "dark" ? 0.5 : 0.7;
    const stylePre = useThemeBackground("primary");
    const styleAreaIndicator = { backgroundColor: colorForArea(announcement.details.Area, saturationValue, 0.76) };
    return (
        <TouchableOpacity
            containerStyle={containerStyle}
            style={[styles.container, appStyles.shadow, styleContainer, style]}
            onPress={() => onPress?.(announcement.details)}
            onLongPress={() => onLongPress?.(announcement.details)}
        >
            <ImageBackground style={[styles.pre, stylePre]} source={announcement.details.Image?.Url ?? null}>
                <View style={[styles.areaIndicator, styleAreaIndicator]} />
            </ImageBackground>

            <View style={styles.main}>
                <Label style={styles.title} type="h3">
                    {announcement.details.NormalizedTitle}
                </Label>
                <Label style={styles.tag} type="regular" ellipsizeMode="head" numberOfLines={1}>
                    {announcement.time} - {announcement.details.Area}
                </Label>
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
    pre: {
        overflow: "hidden",
        width: 70,
        alignItems: "center",
        justifyContent: "center",
    },
    areaIndicator: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        width: 5,
    },
    main: {
        flex: 1,
        padding: 12,
    },
    title: {
        flex: 1,
    },
    tag: {
        textAlign: "right",
    },
});
