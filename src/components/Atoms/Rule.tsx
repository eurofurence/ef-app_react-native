import { useMemo } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import { useTheme } from "../../context/Theme";

export const Rule = () => {
    const theme = useTheme();
    const style = useMemo<ViewStyle>(() => ({ backgroundColor: theme.darken }), [theme]);
    return <View style={[styles.rule, style]} />;
};

const styles = StyleSheet.create({
    rule: {
        height: 1,
        alignSelf: "stretch",
    },
});
