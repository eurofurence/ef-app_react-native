import { ImageBackground, StyleSheet, View } from "react-native";

import { Section } from "../../components/Atoms/Section";
import { conId } from "../../configuration";
import { useTheme } from "../../context/Theme";
import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { eventDaysSelectors } from "../../store/eurofurence.selectors";

export const CountdownHeader = () => {
    const theme = useTheme();
    const [now] = useNow();

    const subtitle = useAppSelector((state) => eventDaysSelectors.selectCountdownTitle(state, now));
    return (
        <View>
            <ImageBackground source={require("../../../assets/images/banner_2022_no_logo.png")} style={styles.background} resizeMode={"cover"}></ImageBackground>
            <Section
                style={{ marginTop: 0, marginBottom: 0, paddingVertical: 15, paddingHorizontal: 20, backgroundColor: theme.background }}
                title={conId}
                icon={"alarm"}
                subtitle={subtitle}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        height: 180,
        flexDirection: "column",
        justifyContent: "flex-end",
    },
});
