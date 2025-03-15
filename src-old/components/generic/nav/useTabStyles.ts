import { StyleSheet, TextStyle } from "react-native";

import { useThemeMemo } from "../../../hooks/themes/useThemeHooks";

export const useTabStyles = () => {
    const highlight = useThemeMemo(
        (theme): TextStyle => ({
            fontWeight: "bold",
            textTransform: "none",
            borderRadius: 6,
            marginHorizontal: -10,
            color: theme.invText,
            backgroundColor: theme.secondary,
        }),
    );

    return { normal: styles.normal, highlight };
};

const styles = StyleSheet.create({
    normal: {
        fontWeight: "bold",
        textTransform: "none",
        marginHorizontal: -10,
    },
});
