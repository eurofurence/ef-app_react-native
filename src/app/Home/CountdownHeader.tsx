import { ImageBackground, StyleSheet, View } from "react-native";

import { Section } from "../../components/Atoms/Section";
import { conId, conName } from "../../configuration";
import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { eventDaysSelectors } from "../../store/eurofurence.selectors";

export const CountdownHeader = () => {
    const [now] = useNow();
    const subtitle = useAppSelector((state) => eventDaysSelectors.selectCountdownTitle(state, now));
    return (
        <ImageBackground source={require("../../../assets/images/banner_2022.png")} style={styles.background} resizeMode={"cover"} blurRadius={8}>
            <View style={styles.inner}>
                <Section title={conId} icon={"alarm"} subtitle={subtitle} />
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        height: 220,
        flexDirection: "column",
        justifyContent: "flex-end",
    },
    inner: {
        padding: 16,
    },
});
