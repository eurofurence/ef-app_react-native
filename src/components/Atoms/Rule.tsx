import { StyleSheet, View } from "react-native";

import { useThemeBackground } from "../../hooks/useThemeHooks";

export const Rule = () => {
    const styleBackground = useThemeBackground("darken");
    return <View style={[styles.rule, styleBackground]} />;
};

const styles = StyleSheet.create({
    rule: {
        height: 1,
        alignSelf: "stretch",
    },
});
