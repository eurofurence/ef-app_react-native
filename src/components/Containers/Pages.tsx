import { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { LayoutRectangle, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { useTheme } from "../../context/Theme";
import { IoniconsNames } from "../../types/Ionicons";
import { Page } from "./Page";

/**
 * Arguments to the pages.
 */
export type PagesProps = {
    /**
     * Style used on the container of the pages.
     */
    style?: StyleProp<ViewStyle>;

    /**
     * If given, page that are layed out.
     */
    pages: {
        /**
         * The icon to display.
         */
        icon?: IoniconsNames;

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
};

export type PagesRef = {
    /**
     * Scroll to the page index.
     * @param index
     */
    scrollTo: (index: number) => void;
};

/**
 * A row of pages.
 */
export const Pages = forwardRef<PagesRef, PagesProps>(({ style, pages, indicatorHeight = 4 }, ref) => {
    // Computed styles.
    const theme = useTheme();
    const fillBackground = useMemo(() => ({ backgroundColor: theme.background }), [theme]);
    const bordersDarken = useMemo(() => ({ borderColor: theme.darken }), [theme]);

    // Width of all pages. Anchors (locations and widths of the individual top tabs, the anchors start out at the given length).
    const [totalWidth, setTotalWidth] = useState(-1);
    const [anchors, setAnchors] = useState<{ x: number; width: number }[]>([]);

    // Updates the anchors.
    const updateAnchors = useCallback(
        (i: number, layout: LayoutRectangle & { left?: number }) => {
            setAnchors((current) => {
                const copy = current.slice();
                copy.length = pages.length;
                copy[i] = { x: layout.left ?? layout.x, width: layout.width };
                return copy;
            });
        },
        [pages]
    );

    // Reference for scrolling to tab.
    const scrollView = useRef<ScrollView>(null);

    // Provide handle for scrolling to the index.
    useImperativeHandle(
        ref,
        () => ({
            scrollTo: (index: number) => {
                // Get anchor. If not present, ignore.
                const anchor = anchors[index];
                if (!anchor) return;

                // Scroll to it but leave space to the left of it.
                const { x, width } = anchor;
                scrollView.current?.scrollTo({
                    x: x - (totalWidth - width) / 2,
                });
            },
        }),
        [anchors, scrollView, totalWidth]
    );

    return (
        <View style={[styles.pages, bordersDarken, fillBackground, style]}>
            <ScrollView
                ref={scrollView}
                contentContainerStyle={styles.content}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                onLayout={(e) => setTotalWidth(e.nativeEvent.layout.width)}
            >
                {pages?.map((tab, i) => (
                    <Page
                        key={i}
                        icon={tab.icon}
                        text={tab.text}
                        active={tab.active}
                        onPress={tab.onPress}
                        indicatorHeight={indicatorHeight}
                        onLayout={(e) => updateAnchors(i, e.nativeEvent.layout)}
                    />
                )) ?? null}
            </ScrollView>
        </View>
    );
});

const styles = StyleSheet.create({
    pages: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    content: {
        minWidth: "100%",
    },
});
