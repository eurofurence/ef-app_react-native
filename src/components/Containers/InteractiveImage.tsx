import { FC } from "react";
import { Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";

import { EnrichedImageRecord } from "../../store/eurofurence.types";

type InteractiveImageProps = {
    image: EnrichedImageRecord;
};

export const InteractiveImage: FC<InteractiveImageProps> = ({ image }) => {
    const screenWidth = useSharedValue(Dimensions.get("window").width / (Dimensions.get("window").height / Dimensions.get("window").width));
    const screenHeight = useSharedValue(Dimensions.get("window").height / (Dimensions.get("window").height / Dimensions.get("window").width));
    const translateX = useSharedValue(0);
    const startX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const startY = useSharedValue(0);
    const scale = useSharedValue(1);
    const savedScale = useSharedValue(1);
    const scaledMaxWidth = useDerivedValue(() => scale.value * screenWidth.value);
    const scaledMaxHeight = useDerivedValue(() => scale.value * screenHeight.value);

    const animatedStyles = useAnimatedStyle(() => {
        console.log({
            translateX: translateX.value,
            scaledWidth: scaledMaxWidth.value,
            scale: scale.value,
        });
        return {
            transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
        };
    });

    const dragGesture = Gesture.Pan()
        .averageTouches(true)
        .onUpdate((e) => {
            translateX.value = e.translationX + startX.value;
            translateY.value = e.translationY + startY.value;
        })
        .onEnd(() => {
            const clamp = (num: number, max: number) => {
                if (num > max) {
                    return max;
                } else if (num < max * -1) {
                    return max * -1;
                }
                return num;
            };
            const finalX = clamp(translateX.value, scaledMaxWidth.value);
            const finalY = clamp(translateY.value, scaledMaxHeight.value);
            startX.value = finalX;
            translateX.value = withTiming(finalX);
            startY.value = finalY;
            translateY.value = withTiming(finalY);
        });

    const zoomGesture = Gesture.Pinch()
        .onUpdate((event) => {
            scale.value = savedScale.value * event.scale;
        })
        .onEnd(() => {
            const clamp = (num: number, min: number, max: number) => {
                if (num > max) {
                    return max;
                } else if (num < min) {
                    return min;
                }
                return num;
            };

            scale.value = withTiming(clamp(savedScale.value, 1, 5));
        });

    const doubleTapGesture = Gesture.Tap()
        .maxDuration(250)
        .numberOfTaps(2)
        .onEnd((event) => {
            if (scale.value > 1) {
                scale.value = withTiming(1);
                savedScale.value = 1;
            } else {
                scale.value = withTiming(3);
                savedScale.value = 3;
            }
            translateX.value = withTiming(0);
            translateY.value = withTiming(0);
            startX.value = translateX.value;
            startY.value = translateY.value;
        });

    const composed = Gesture.Simultaneous(doubleTapGesture, dragGesture, zoomGesture);

    return (
        <GestureDetector gesture={composed}>
            <Animated.Image source={{ uri: image.ImageUrl }} style={[{ flex: 1 }, animatedStyles]} resizeMode={"contain"} />
        </GestureDetector>
    );
};
