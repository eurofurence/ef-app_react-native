import { FC } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { EnrichedImageRecord } from "../../store/eurofurence.types";

type InteractiveImageProps = {
    image: EnrichedImageRecord;
};

const scaleSpring = { overshootClamping: true };

export const InteractiveImage: FC<InteractiveImageProps> = ({ image }) => {
    const translateX = useSharedValue(0);
    const startX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const startY = useSharedValue(0);
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
        };
    });

    // todo: make it so it cannot scroll out of bounds
    const dragGesture = Gesture.Pan()
        .averageTouches(true)
        .onUpdate((e) => {
            translateX.value = e.translationX + startX.value;
            translateY.value = e.translationY + startY.value;
        })
        .onEnd(() => {
            startX.value = translateX.value;
            startY.value = translateY.value;
        });

    const zoomGesture = Gesture.Pinch()
        .onUpdate((event) => {
            scale.value = savedScale.value * event.scale;
        })
        .onEnd(() => {
            if (scale.value > 5) {
                savedScale.value = 5;
            } else if (scale.value < 1) {
                savedScale.value = 1;
            } else {
                savedScale.value = scale.value;
            }
            scale.value = withTiming(savedScale.value);
        });

    const doubleTapGesture = Gesture.Tap()
        .maxDuration(250)
        .numberOfTaps(2)
        .onEnd(() => {
            if (scale.value > 1) {
                scale.value = withTiming(1);
                savedScale.value = 1;

                translateX.value = withTiming(0);
                translateY.value = withTiming(0);
            } else {
                scale.value = withTiming(3);
                savedScale.value = 3;
            }
        });

    const composed = Gesture.Simultaneous(doubleTapGesture, dragGesture, zoomGesture);

    return (
        <GestureDetector gesture={composed}>
            <Animated.Image source={{ uri: image.ImageUrl }} style={[{ flex: 1 }, animatedStyles]} resizeMode={"contain"} />
        </GestureDetector>
    );
};
