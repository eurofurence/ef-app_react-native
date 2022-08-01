import { FC, useMemo } from "react";
import * as React from "react";
import { ImageStyle, StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

import { useTheme } from "../../context/Theme";
import { ImageEx, ImageExProps } from "../Atoms/ImageEx";

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
    image: ImageExProps["image"];

    /**
     * The targeted point and the dimension to make visible.
     */
    target: ImageExProps["target"];

    /**
     * If given, invoked on button press.
     */
    onPress?: () => void;

    /**
     * If given, invoked on long press.
     */
    onLongPress?: () => void;
};

export const ImageExButton: FC<ImageButtonProps> = ({ style, image, target, children, onPress, onLongPress }) => {
    const theme = useTheme();

    const styleBackground = useMemo<ViewStyle>(() => ({ backgroundColor: theme.inverted }), [theme]);
    const styleImage = useMemo<ImageStyle>(() => ({ opacity: children ? 0.7 : 1.0 }), [children]);

    return (
        <TouchableOpacity style={[styles.container, styleBackground, style]} onPress={onPress} onLongPress={onLongPress}>
            <ImageEx style={styleImage} image={image} target={target} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 120,
        borderRadius: 16,
        overflow: "hidden",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
});
