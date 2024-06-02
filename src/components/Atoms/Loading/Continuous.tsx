import { FC, useEffect } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withTiming } from "react-native-reanimated";

import { useThemeBackground } from "../../../hooks/useThemeHooks";

/**
 * Props for the continuous indicator.
 */
export type ContinuousProps = {
    /**
     * Style passed to root.
     */
    style?: StyleProp<ViewStyle>;

    /**
     * True if the progress indicator should be displayed.
     */
    active?: boolean;
};

export const Continuous: FC<ContinuousProps> = ({ style, active = true }) => {
    // Shared at value.
    const at = useSharedValue(0);

    // Set animation in reaction to active.
    useEffect(() => {
        if (active) {
            // Active, set to zero and animate.
            at.value = 0;
            at.value = withRepeat(withDelay(600, withTiming(1, { duration: 900, easing: Easing.in(Easing.cubic) })), -1);
        } else {
            // Inactive set to out of bounds.
            at.value = -1;
        }
    }, [at, active]);

    // Convert theme into style.
    const colorStyle = useThemeBackground("secondary");

    // Compute dynamic style animating the bar.
    const dynamicStyle = useAnimatedStyle(
        () => ({
            left: `${(1 - at.value) * 140 - 20}%`,
            width: "20%",
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
