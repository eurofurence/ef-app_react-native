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
        <View>
            <ImageBackground source={require("../../../assets/images/banner_2022_no_logo.png")} style={styles.background} resizeMode={"cover"}></ImageBackground>
            <View style={styles.inner}>
                <Section title={conId} icon={"alarm"} subtitle={subtitle} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        height: 180,
        flexDirection: "column",
        justifyContent: "flex-end",
    },
    inner: {
        width: 600,
        alignSelf: "center",
    },
});
