import { FC, useMemo } from "react";
import { StyleSheet, View } from "react-native";

import { useTheme } from "../../context/Theme";
import { IconiconsNames } from "../../types/Ionicons";
import { Page } from "./Page";

/**
 * Arguments to the pages.
 */
export interface PagesProps {
    /**
     * If given, page that are layed out.
     */
    pages?: {
        /**
         * The icon to display.
         */
        icon?: IconiconsNames;

        /**
         * The name of the page.
         */
        text: string;

        /**
         * True if to be rendered as active.
         */
        active?: boolean;

        /**
         * If given, invoked when the page is pressed.
         */
        onPress?: () => void;
    }[];

    /**
     * Height of the active indicators.
     */
    indicatorHeight?: number;
}

/**
 * A row of pages.
 */
export const Pages: FC<PagesProps> = ({ pages, indicatorHeight = 4 }) => {
    // Computed styles.
    const theme = useTheme();
    const fillBackground = useMemo(() => ({ backgroundColor: theme.background }), [theme]);
    const bordersDarken = useMemo(() => ({ borderColor: theme.darken }), [theme]);

    return (
        <View style={[styles.pages, bordersDarken, fillBackground]}>
            {/* Pages. */}
            {pages?.map((tab, i) => <Page key={i} icon={tab.icon} text={tab.text} active={tab.active} onPress={tab.onPress} indicatorHeight={indicatorHeight} />) ?? null}
        </View>
    );
};

const styles = StyleSheet.create({
    pages: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
});
