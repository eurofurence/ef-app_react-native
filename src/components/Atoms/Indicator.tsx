import { FC, useEffect, useMemo } from "react";
import { ColorValue, StyleSheet, ViewStyle } from "react-native";
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withDelay, withRepeat, withSequence, withTiming } from "react-native-reanimated";

import { useTheme } from "../../context/Theme";

export type IndicatorProps = {
    color: ColorValue;
};

export const Indicator: FC<IndicatorProps> = ({ color }) => {
    const theme = useTheme();
    const at = useSharedValue(0);

    useEffect(() => {
        at.value = 0;
        at.value = withRepeat(
            withSequence(
                // Animate in.
                withDelay(1000, withTiming(1, { duration: 1000 })),
                // Animate out.
                withDelay(1000, withTiming(0, { duration: 1000 }))
            ),
            -1
        );

        return () => cancelAnimation(at);
    }, []);

    const styleIndicator = useMemo<ViewStyle>(() => ({ backgroundColor: color }), [theme]);

    const dynamicIndicator = useAnimatedStyle(
        () => ({
            opacity: at.value,
        }),
        [at]
    );

    return <Animated.View style={[styles.indicator, styleIndicator, dynamicIndicator]} />;
};

const styles = StyleSheet.create({
    indicator: {
        width: 4,
        height: 4,
        borderRadius: 4,
    },
});
