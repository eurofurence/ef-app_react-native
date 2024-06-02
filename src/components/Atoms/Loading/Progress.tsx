import { FC, useEffect } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { useThemeBackground } from "../../../hooks/useThemeHooks";

/**
 * Props for the progress indicator.
 */
export type ProgressProps = {
    /**
     * Style passed to root.
     */
    style?: StyleProp<ViewStyle>;

    /**
     * The value to show at between zero and one.
     */
    value?: number;
};

export const Progress: FC<ProgressProps> = ({ style, value }) => {
    // Shared at value.
    const at = useSharedValue(value ?? 0);

    // Set shared value from input via effect reaction.
    useEffect(() => {
        at.value = withTiming(value ?? 0, { duration: 234 });
    }, [at, value]);

    // Convert theme into style.
    const colorStyle = useThemeBackground("secondary");

    // Compute dynamic style animating the bar.
    const dynamicStyle = useAnimatedStyle(
        () => ({
            left: 0,
            width: `${at.value * 100}%`,
        }),
        [at],
    );

    return (
        <View style={[styles.container, style]}>
            <Animated.View style={[styles.bar, colorStyle, dynamicStyle]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
        alignSelf: "stretch",
        height: 2,
    },
    bar: {
        position: "absolute",
        top: 0,
        bottom: 0,
    },
});
