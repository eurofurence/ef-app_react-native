import { forwardRef, ReactNode, useEffect, useImperativeHandle, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

/**
 * Arguments to the pager.
 */
export type PagerProps = {
    /**
     * Main view style.
     */
    style?: StyleProp<ViewStyle>;

    /**
     * Left content.
     */
    left?: ReactNode;

    /**
     * Right content.
     */
    right?: ReactNode;
};

/**
 * Operations provided by the pager.
 */
export type PagerRef = {
    /**
     * Moves to the left page with animations.
     */
    toLeft(): void;

    /**
     * Moves to the right page with animations.
     */
    toRight(): void;

    /**
     * Moves to the left page immediately.
     */
    toLeftImmediately(): void;

    /**
     * Moves to the right page immediately.
     */
    toRightImmediately(): void;
};

export const Pager = forwardRef<PagerRef, PagerProps>(({ style, left, right }, ref) => {
    // Maintain internal state where the page is.
    const [isRight, setIsRight] = useState(false);

    // Use layout width.
    const [width, setWidth] = useState(100);

    // Use to flip the pages.
    const offset = useSharedValue(0);

    // React to desired right-ness.
    useEffect(() => {
        if (isRight && offset.value < 1) offset.value = withTiming(1, { duration: 234, easing: Easing.out(Easing.cubic) });
        else if (!isRight && offset.value > 0) offset.value = withTiming(0, { duration: 234, easing: Easing.out(Easing.cubic) });
    }, [isRight, offset]);

    // Animate transformation for page flipping (half of total width).
    const dynamicContainer = useAnimatedStyle(
        () => ({
            transform: [{ translateX: -0.5 * width * offset.value }],
        }),
        [width, offset]
    );

    // Handle to invoke internal mutations from outside if needed.
    useImperativeHandle(
        ref,
        () => ({
            toLeft: () => setIsRight(false),
            toRight: () => setIsRight(true),
            toLeftImmediately: () => {
                offset.value = 0;
                setIsRight(false);
            },
            toRightImmediately: () => {
                offset.value = 1;
                setIsRight(true);
            },
        }),
        [offset]
    );

    // Double width row that starts on the left. Translates the right part via status.
    return (
        <Animated.View style={[styles.pages, style, dynamicContainer]} onLayout={(e) => setWidth(e.nativeEvent.layout.width || width)}>
            <View style={styles.equal}>{left}</View>
            <View style={styles.equal}>{right}</View>
        </Animated.View>
    );
});

const styles = StyleSheet.create({
    pages: {
        flexDirection: "row",
        left: 0,
        width: "200%",
        alignItems: "flex-end",
    },
    equal: {
        flex: 1,
    },
});
