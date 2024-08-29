import { useIsFocused } from "@react-navigation/core";
import { TFunction } from "i18next";
import { chain } from "lodash";
import { Moment } from "moment";
import moment from "moment/moment";
import React, { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import { conId, conName } from "../../configuration";
import { useNow } from "../../hooks/time/useNow";
import { useAppSelector } from "../../store";
import { eventDaysSelectors } from "../../store/eurofurence/selectors/records";
import { EventDayRecord } from "../../store/eurofurence/types";
import { assetSource } from "../../util/assets";
import { Image } from "../generic/atoms/Image";
import { ImageBackground } from "../generic/atoms/ImageBackground";
import { Label } from "../generic/atoms/Label";
import { Col } from "../generic/containers/Col";
import { Row } from "../generic/containers/Row";

export type CountdownHeaderProps = {
    style?: StyleProp<ViewStyle>;
};

const bannerBreakpoint = 600;
const useCountdownTitle = (t: TFunction, now: Moment) => {
    const days = useAppSelector(eventDaysSelectors.selectAll);

    const firstDay: EventDayRecord | undefined = chain(days)
        .orderBy((it) => it.Date, "asc")
        .first()
        .value();
    const lastDay: EventDayRecord | undefined = chain(days)
        .orderBy((it) => it.Date, "desc")
        .last()
        .value();

    const currentDay: EventDayRecord | undefined = days.find((it) => now.isSame(it.Date, "day"));
    if (currentDay) {
        return currentDay.Name;
    } else if (firstDay && now.isBefore(firstDay.Date, "day")) {
        const diff = moment.duration(now.diff(firstDay.Date)).humanize();
        return t("before_event", { conName, diff });
    } else if (lastDay && now.isAfter(lastDay.Date, "day")) {
        return t("after_event");
    } else {
        return "";
    }
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
            <Image style={styles.logo} source={assetSource("banner_logo")} contentFit="contain" priority="high" />
            <Col style={styles.textContainer}>
                <Row type="center">
                    <Label style={styles.textContainerFill} type="xl" variant="shadow" color="white" ellipsizeMode="tail">
                        {conId}
                    </Label>
                </Row>

                {!subtitle ? null : (
                    <Row type="center">
                        <Label style={styles.textContainerFill} type="compact" variant="shadow" color="white" ellipsizeMode="tail">
                            {subtitle}
                        </Label>
                    </Row>
                )}
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
        paddingTop: 15,
        paddingHorizontal: 15,
        flexDirection: "row",
        alignItems: "flex-end",
    },
    textContainer: {
        flex: 1,
        paddingTop: 30,
        paddingBottom: 5,
    },
    textContainerFill: {
        flex: 1,
    },
    section: {
        marginTop: 0,
    },
    logo: {
        aspectRatio: 1,
        height: 130,
        marginLeft: -25,
        marginRight: -15,
    },
});
