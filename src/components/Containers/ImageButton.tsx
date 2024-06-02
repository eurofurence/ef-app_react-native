import * as React from "react";
import { FC, useMemo } from "react";
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

import { ThemeColor } from "../../context/Theme";
import { useTheme, useThemeBackground } from "../../hooks/themes/useThemeHooks";
import { IconNames } from "../Atoms/Icon";
import { ImageFill, ImageFillProps } from "../Atoms/ImageFill";
import { Marker } from "../Atoms/Marker";

/**
 * Arguments to the button.
 */
export type ImageButtonProps = {
    /**
     * The style button.
     */
    style?: StyleProp<ViewStyle>;

    /**
     * The source image object.
     */
    image: ImageFillProps["image"];

    /**
     * The targeted point and the dimension to make visible.
     */
    target: ImageFillProps["target"];

    /**
     * True if no indicator should be displayed.
     */
    noMarker?: boolean;
    markerColor?: ThemeColor;
    markerType?: IconNames;
    markerSize?: number;

    /**
     * If given, invoked on button press.
     */
    onPress?: () => void;

    /**
     * If given, invoked on long press.
     */
    onLongPress?: () => void;
};

export const ImageExButton: FC<ImageButtonProps> = ({ style, image, target, noMarker = false, markerColor, markerType, markerSize, onPress, onLongPress }) => {
    const styleBackground = useThemeBackground("inverted");

    return (
        <TouchableOpacity style={[styles.container, styleBackground, style]} onPress={onPress} onLongPress={onLongPress}>
            {!target || !image ? null : <ImageFill image={image} target={target} />}
            {noMarker ? null : <Marker style={styles.marker} markerColor={markerColor} markerType={markerType} markerSize={markerSize} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 160,
        borderRadius: 16,
        overflow: "hidden",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    marker: {
        left: "50%",
        top: "50%",
    },
});
