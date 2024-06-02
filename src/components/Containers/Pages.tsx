import React, { forwardRef, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import { LayoutRectangle, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { SharedValue, useAnimatedStyle } from "react-native-reanimated";

import { Page } from "./Page";
import { useTheme, useThemeBackground } from "../../hooks/useThemeHooks";
import { IconNames } from "../Atoms/Icon";

/**
 * Arguments to the pages.
 */
export type PagesProps = {
    /**
     * Style used on the container of the pages.
     */
    style?: StyleProp<ViewStyle>;

    /**
     * If given, page that are laid out.
     */
    pages: {
        /**
         * The icon to display.
         */
        icon?: IconNames;

        /**
         * The name of the page.
         */
        text: string;

        /**
         * True if to be rendered as active.
         */
        active?: boolean;

        /**
         * True if to be rendered as highlighted.
         */
        highlight?: boolean;

        /**
         * If given, invoked when the page is pressed.
         */
        onPress?: () => void;
    }[];

    /**
     * Index of the page to display as active. Can be a real-valued shared value.
     */
    indicatorIndex?: number | SharedValue<number>;

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
export const Pages = forwardRef<PagesRef, PagesProps>(({ style, pages, indicatorIndex = -1, indicatorHeight = 4 }, ref) => {
    // Computed styles.
    const styleIndicator = useThemeBackground("secondary");
    const styleIndicatorHeight = { height: indicatorHeight };
    const styleBackground = useThemeBackground("background");
    const styleDarken = useThemeBackground("darken");

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
        [pages],
    );

    const dynamicIndicator = useAnimatedStyle(() => {
        // Get base values for interpolation.
        const value = typeof indicatorIndex === "number" ? indicatorIndex : indicatorIndex.value;
        const lower = Math.floor(value);
        const upper = Math.ceil(value);
        const anchorLower = anchors[lower];
        const anchorUpper = anchors[upper];
        const inf = value - lower;

        // Interpolate between the valid points, use a single one if equal or at an end.
        let left, width;
        if (!anchorLower && !anchorUpper) [left, width] = [0, 0];
        else if (!anchorUpper || anchorLower === anchorUpper) [left, width] = [anchorLower.x, anchorLower.width];
        else if (!anchorLower) [left, width] = [anchorUpper.x, anchorUpper.width];
        else [left, width] = [(1 - inf) * anchorLower.x + inf * anchorUpper.x, (1 - inf) * anchorLower.width + inf * anchorUpper.width];

        // Transform to center, then scale by width, then translate to adequate position.
        return {
            transform: [{ translateX: left }, { scaleX: width }, { translateX: 0.5 }],
        };
    }, [anchors, indicatorIndex]);

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
        [anchors, scrollView, totalWidth],
    );

    return (
        <View style={[styles.pages, styleDarken, styleBackground, style]}>
            <ScrollView
                ref={scrollView}
                contentContainerStyle={styles.content}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                onLayout={(e) => setTotalWidth(e.nativeEvent.layout.width)}
            >
                <Animated.View style={[styles.indicator, styleIndicator, styleIndicatorHeight, dynamicIndicator]} />
                {pages?.map((page, i) => (
                    <Page
                        key={i}
                        icon={page.icon}
                        text={page.text}
                        active={page.active}
                        highlight={page.highlight}
                        onPress={page.onPress}
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
    indicator: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: 1,
    },
});
