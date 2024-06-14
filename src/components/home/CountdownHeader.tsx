import { useIsFocused } from "@react-navigation/core";
import { useAssets } from "expo-asset";
import { Image, ImageBackground } from "expo-image";
import { TFunction } from "i18next";
import { chain } from "lodash";
import { Moment } from "moment";
import moment from "moment/moment";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import { conId, conName } from "../../configuration";
import { useNow } from "../../hooks/time/useNow";
import { useAppSelector } from "../../store";
import { eventDaysSelectors } from "../../store/eurofurence.selectors";
import { EventDayRecord } from "../../store/eurofurence.types";
import { assetSource } from "../../util/assets";
import { Section } from "../generic/atoms/Section";

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
            <ImageBackground key="banner" style={styles.background} source={assetSource(width < bannerBreakpoint ? "banner_ef27_narrow" : "banner_ef27_wide")} contentFit="cover" />
            <Section
                style={styles.section}
                title={conId}
                icon="alarm"
                subtitle={subtitle}
                titleColor="white"
                subtitleColor="white"
                titleVariant="shadow"
                subtitleVariant="shadow"
            />
            <Image style={styles.logo} source={assetSource("banner_ef27_logo")} contentFit="contain" />
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.6,
    },
    container: {
        minHeight: 180,
        paddingTop: 15,
        paddingHorizontal: 15,
        flexDirection: "column-reverse",
    },
    section: {
        marginTop: 0,
    },
    logo: {
        width: "50%",
        height: "auto",
        maxWidth: 200,
        aspectRatio: 1,
        alignSelf: "center",
    },
});
