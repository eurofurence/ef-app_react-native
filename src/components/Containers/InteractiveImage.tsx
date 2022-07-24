import { debounce } from "lodash";
import { FC, useMemo } from "react";
import { Dimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";

import { EnrichedImageRecord } from "../../store/eurofurence.types";

export type VisibleViewBounds = { left: number; top: number; right: number; bottom: number };
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

    /**
     * The minimum scale that can be zoomed out to.
     * @default 1
     */
    minScale?: number;

    /**
     * The maximum scale that can be zoomed in to.
     * @default 5
     */
    maxScale?: number;

    /**
     * Log debug messages to see what the view is doing
     */
    debug?: boolean;
};

/**
 * Rescale a point from one range to another range.
 * @param pixelPoint The point on the originalRange.
 * @param originalRangeWidth The width of the original range
 * @param targetRangeWidth The width of the target range
 */
export const rescale = (pixelPoint: number, originalRangeWidth: number, targetRangeWidth: number) => {
    const originalAsPercentage = 1 - (originalRangeWidth - pixelPoint) / originalRangeWidth;
    return Math.round(originalAsPercentage * targetRangeWidth);
};

/**
 * Convert an offset to an absolute number.
 * @param absoluteOffset The offset for the item
 * @param scaleFactor The amount that we are scaled in
 * @param axisRange The maximum value that should be in the range.
 */
export const offsetToAbsolute = (absoluteOffset: number, scaleFactor: number, axisRange: number): [number, number] => {
    const scaledOffset = absoluteOffset / scaleFactor;
    const middle = axisRange / 2;
    const middleWithOffset = middle - scaledOffset;
    const bandwidth = middle / scaleFactor;
    return [Math.floor(middleWithOffset - bandwidth), Math.ceil(middleWithOffset + bandwidth)];
};

export const InteractiveImage: FC<InteractiveImageProps> = ({ image, onBoundsUpdated, debounceTimeout, minScale = 1, maxScale = 5, debug }) => {
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

        return debounce((focalX: number, focalY: number, scale: number) => {
            const [left, right] = offsetToAbsolute(focalX, scale, width);
            const [top, bottom] = offsetToAbsolute(focalY, scale, height);

            const boxBounds = {
                left,
                right,
                top,
                bottom,
            };

            const imageBounds = {
                left: rescale(left, width, image.Width),
                right: rescale(right, width, image.Width),
                top: rescale(top, height, image.Height),
                bottom: rescale(bottom, height, image.Height),
            };
            debug && console.log("bounds updated", boxBounds);

            if (onBoundsUpdated) {
                onBoundsUpdated(imageBounds);
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
                debug &&
                    console.log("Clamping", {
                        num,
                        min,
                        max,
                    });
                if (num > max) {
                    return max;
                } else if (num < min) {
                    return min;
                }
                return num;
            };

            // Make sure that the scale is always between 1 and 5
            scale.value = withTiming(clamp(scale.value, minScale, maxScale));
            savedScale.value = clamp(scale.value, minScale, maxScale);
        });

    const doubleTapGesture = Gesture.Tap()
        .maxDuration(250)
        .numberOfTaps(2)
        .onEnd((event) => {
            if (scale.value >= maxScale) {
                debug && console.log("zoom", "resetting to 1");
                // If we're zoomed in, reset
                scale.value = withTiming(1);
                savedScale.value = 1;
            } else if (scale.value >= maxScale / 2) {
                debug && console.log("zoom", "going to max");
                // If we're half of the max scale, zoom to max
                scale.value = withTiming(maxScale);
                savedScale.value = maxScale;
            } else {
                debug && console.log("zoom", "going to halfway");
                // If we're not halfway to max, go to halfway to max
                scale.value = withTiming(maxScale / 2);
                savedScale.value = maxScale / 2;
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
