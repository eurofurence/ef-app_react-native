import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Image, ImageBackground, StyleProp, StyleSheet, useWindowDimensions, View, ViewStyle } from "react-native";

import { Section } from "../../components/Atoms/Section";
import { conId } from "../../configuration";
import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { selectCountdownTitle } from "../../store/eurofurence.selectors";

export type CountdownHeaderProps = {
    style?: StyleProp<ViewStyle>;
};

const bannerBreakpoint = 600;
const bannerNarrowSrc = require("../../../assets/images/banner-ef27-narrow.png");
const bannerFullSrc = require("../../../assets/images/banner-ef27.png");
const logoSrc = require("../../../assets/images/banner_2023_logo.png");

export const CountdownHeader: FC<CountdownHeaderProps> = ({ style }) => {
    const { t } = useTranslation("Countdown");
    const [now] = useNow();

    // Pick background based on device dimensions.
    const { width } = useWindowDimensions();
    const background = useMemo(() => (width < bannerBreakpoint ? bannerNarrowSrc : bannerFullSrc), [width]);

    const subtitle = useAppSelector((state) => selectCountdownTitle(state, now, t));
    return (
        <View style={[styles.container, style]}>
            <ImageBackground style={styles.background} source={background} resizeMode="cover" />

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
            <Image style={styles.logo} source={logoSrc} resizeMode="contain" />
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
