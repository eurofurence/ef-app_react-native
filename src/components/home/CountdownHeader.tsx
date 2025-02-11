import { useIsFocused } from "@react-navigation/core";
import { TFunction } from "i18next";
import { chain } from "lodash";
import moment, { Moment } from "moment-timezone";

import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import { conId, conName, conTimeZone } from "../../configuration";
import { useNow } from "../../hooks/time/useNow";
import { useAppSelector } from "../../store";
import { eventDaysSelectors } from "../../store/eurofurence/selectors/records";
import { EventDayRecord } from "../../store/eurofurence/types";
import { assetSource } from "../../util/assets";
import { Image } from "../generic/atoms/Image";
import { ImageBackground } from "../generic/atoms/ImageBackground";
import { Label, labelTypeStyles } from "../generic/atoms/Label";
import { Col } from "../generic/containers/Col";

export type CountdownHeaderProps = {
    style?: StyleProp<ViewStyle>;
};

const bannerBreakpoint = 600;

const useCountdownTitle = (t: TFunction, now: Moment) => {
    const days = useAppSelector(eventDaysSelectors.selectAll);

    // Corrected sorting
    const firstDay: EventDayRecord | undefined = chain(days)
        .orderBy((it) => it.Date, "asc") // Sort ascending for first day
        .first() // Pick earliest event date
        .value();

    const lastDay: EventDayRecord | undefined = chain(days)
        .orderBy((it) => it.Date, "desc") // Sort descending for last day
        .first() // Pick latest event date
        .value();

    // Try finding current day.
    const currentDay: EventDayRecord | undefined = days.find((it) => now.isSame(moment.tz(it.Date, conTimeZone), "day"));
    if (currentDay) {
        return currentDay.Name;
    }

    // Check if before first day.
    if (firstDay) {
        const firstDateMoment = moment.tz(firstDay.Date, conTimeZone);
        if (now.isBefore(firstDateMoment, "day")) {
            const diff = moment.duration(firstDateMoment.diff(now)).humanize();
            return t("before_event", { conName, diff });
        }
    }

    // Check if after last day.
    if (lastDay) {
        const lastDateMoment = moment.tz(lastDay.Date, conTimeZone);
        if (now.isAfter(lastDateMoment, "day")) {
            return t("after_event");
        }
    }

    // This is only returned if there are no event days from the API.
    return conName;
};

export const CountdownHeader: FC<CountdownHeaderProps> = ({ style }) => {
    const { t } = useTranslation("Countdown");
    const isFocused = useIsFocused();
    const now = useNow(isFocused ? 60 : "static");

    // Pick background based on device dimensions.
    const { width } = useWindowDimensions();

    const subtitle = useCountdownTitle(t, now);

    return (
        <View style={[styles.container, style]}>
            <ImageBackground
                key="banner"
                style={StyleSheet.absoluteFill}
                source={assetSource(width < bannerBreakpoint ? "banner_narrow" : "banner_wide")}
                contentFit="cover"
                priority="high"
            />
            <View style={[StyleSheet.absoluteFill, styles.cover]} />
            <Image style={styles.logo} source={assetSource("banner_logo")} priority="high" />
            <Col variant="end" style={styles.textContainer}>
                <Label type="xl" variant="shadow" color="white" ellipsizeMode="tail">
                    {conId}
                </Label>

                {/* Subtitle is pushed up a bit and to the left, as the conID label has a lot of extra whitespace before */}
                {/* due to font characteristics. This lines that up. The bottom margin is set to negative to eliminate */}
                {/* the extra space due to normal line height. */}
                <Label ml={2} mb={labelTypeStyles.compact.fontSize - labelTypeStyles.compact.lineHeight} type="compact" variant="shadow" color="white" ellipsizeMode="tail">
                    {subtitle}
                </Label>
            </Col>
        </View>
    );
};

const styles = StyleSheet.create({
    cover: {
        backgroundColor: "#00000060",
    },
    container: {
        height: 240,
        padding: 10,
        flexDirection: "row",
        alignItems: "flex-end",
        gap: 10,
    },
    textContainer: {
        flex: 1,
    },
    logo: {
        height: 130,
        aspectRatio: 682 / 1139,
    },
});
