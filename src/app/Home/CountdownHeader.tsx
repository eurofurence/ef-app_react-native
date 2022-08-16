import { FC } from "react";
import { useTranslation } from "react-i18next";
import { ImageBackground, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { Section } from "../../components/Atoms/Section";
import { conId } from "../../configuration";
import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { selectCountdownTitle } from "../../store/eurofurence.selectors";

export type CountdownHeaderProps = {
    style?: StyleProp<ViewStyle>;
};

export const CountdownHeader: FC<CountdownHeaderProps> = ({ style }) => {
    const { t } = useTranslation("Countdown");
    const [now] = useNow();

    const subtitle = useAppSelector((state) => selectCountdownTitle(state, now, t));
    return (
        <View style={[styles.container, style]}>
            <ImageBackground style={StyleSheet.absoluteFill} source={require("../../../assets/images/banner_2022_no_logo.png")} resizeMode="cover" />

            <Section title={conId} icon="alarm" subtitle={subtitle} titleColor="white" subtitleColor="white" titleVariant="shadow" subtitleVariant="shadow" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 180,
        paddingTop: 15,
        paddingHorizontal: 15,
        flexDirection: "column-reverse",
    },
});
