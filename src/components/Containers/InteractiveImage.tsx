import { debounce } from "lodash";
import { FC, useMemo } from "react";
import { Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";

import { EnrichedImageRecord } from "../../store/eurofurence.types";

type InteractiveImageProps = {
    /**
     * The image you want to render
     */
    image: EnrichedImageRecord;

    /**
     * A callback that is fired when a user interacts with the image. It represents the visible part of the `image` prop
     */
    onBoundsUpdated?: (bounds: { left: number; top: number; right: number; bottom: number }) => void;

    /**
     * Set the wait time in between status updates.
     * @default 300
     */
    debounceTimeout?: number;
};

export const InteractiveImage: FC<InteractiveImageProps> = ({ image, onBoundsUpdated, debounceTimeout }) => {
    // Make the screen dimensions available for Reanimated
    const screenWidth = useSharedValue(Dimensions.get("window").width / (Dimensions.get("window").height / Dimensions.get("window").width));
    const screenHeight = useSharedValue(Dimensions.get("window").height / (Dimensions.get("window").height / Dimensions.get("window").width));

    // Hold the translation values
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);

    // Hold the translation values while panning
    const startX = useSharedValue(0);
    const startY = useSharedValue(0);

    // Hold the scale
    const scale = useSharedValue(1);

    // Hold the scale while pinching
    const savedScale = useSharedValue(1);

    // Calculate the maximum edges that a user can pan to. These correspond to the current scale
    const scaledMaxWidth = useDerivedValue(() => scale.value * screenWidth.value);
    const scaledMaxHeight = useDerivedValue(() => scale.value * screenHeight.value);

    // Make sure that the parent can receive updates but also make sure it does not overload the parent with a gazillion callbacks
    const debouncedUpdateHandler = useMemo(() => {
        const width = Dimensions.get("window").width;
        const height = Dimensions.get("window").height;

        const widthScale = image.Width / width;
        const heightScale = image.Height / height;

        return debounce((focalX: number, focalY: number, scale: number) => {
            // todo: this does not properly calculate the parts of the image in view yet.
            const right = width - focalX / scale;
            const left = right - width;

            const bottom = height - focalY / scale;
            const top = bottom - height;
            const bounds = {
                left: left * widthScale,
                right: right * widthScale,
                top: top * heightScale,
                bottom: bottom * heightScale,
            };
            console.log("bounds updated", bounds);

            if (onBoundsUpdated) {
                onBoundsUpdated({
                    left,
                    right,
                    top,
                    bottom,
                });
            }
        }, debounceTimeout ?? 300);
    }, [onBoundsUpdated]);

    // Call the debounced handler on JS
    useDerivedValue(() => runOnJS(debouncedUpdateHandler)(translateX.value, translateY.value, scale.value));

    const animatedStyles = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
    }));

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
            // Make sure the X and Y can never escape the scaled screen limits
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

            // Make sure that the scale is always between 1 and 5
            scale.value = withTiming(clamp(savedScale.value, 1, 5));
        });

    const doubleTapGesture = Gesture.Tap()
        .maxDuration(250)
        .numberOfTaps(2)
        .onEnd((event) => {
            if (scale.value > 1) {
                // If we're zoomed in, reset
                scale.value = withTiming(1);
                savedScale.value = 1;
            } else {
                // If we're not zoomed in, set it to medium zoom
                scale.value = withTiming(3);
                savedScale.value = 3;
            }
            // Reset scaling
            // TODO: make this center on the double tap
            translateX.value = withTiming(0);
            translateY.value = withTiming(0);
            startX.value = translateX.value;
            startY.value = translateY.value;
        });

    // Combine all the gestures so we can do them simultaneously
    const composed = Gesture.Simultaneous(doubleTapGesture, dragGesture, zoomGesture);

    return (
        <GestureDetector gesture={composed}>
            <Animated.Image source={{ uri: image.ImageUrl }} style={[{ flex: 1 }, animatedStyles]} resizeMode={"contain"} />
        </GestureDetector>
    );
};
