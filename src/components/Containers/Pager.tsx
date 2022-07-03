import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react"
import { View } from "react-native"
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { Button } from "./Button";

const quickCubicOut = {
    duration: 234,
    easing: Easing.out(Easing.cubic),
};

export const Pager = forwardRef(({ style, left, right }, ref) => {
    const [isRight, setIsRight] = useState(false);


    const [width, setWidth] = useState(100);
    const offset = useSharedValue(0);

    useEffect(() => {
        if (isRight && offset.value < 1)
            offset.value = withTiming(1, quickCubicOut)
        else if (!isRight && offset.value > 0)
            offset.value = withTiming(0, quickCubicOut)
    }, [isRight, offset])

    const dynamicContainer = useAnimatedStyle(() => ({
        transform: [{ translateX: -0.5 * width * offset.value }]
    }), [width, offset]);

    useImperativeHandle(ref, () => ({
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
    }), [offset]);

    return <Animated.View
        style={[{ flexDirection: 'row', left: 0, width: '200%' }, style, dynamicContainer,]}
        onLayout={e => setWidth(e.nativeEvent.layout.width)}>
        <View style={{ flex: 1 }}>
            {left}
        </View>
        <View style={{ flex: 1 }}>
            {right}
        </View>
    </Animated.View>
});