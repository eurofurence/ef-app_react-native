import { StyleSheet, View, ViewStyle } from "react-native";

import { useThemeBackground } from "@/hooks/themes/useThemeHooks";

export type RuleProps = {
    style?: ViewStyle;
};
export const Rule = ({ style }: RuleProps) => {
    const styleBackground = useThemeBackground("darken");
    return <View style={[styles.rule, styleBackground, style]} />;
};

const styles = StyleSheet.create({
    rule: {
        height: 1,
        alignSelf: "stretch",
    },
});
