import * as React from "react";
import { FC, useMemo, useState } from "react";
import { Dimensions, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { Image, ImageProps } from "./Image";
import { ImageDetails } from "../../../store/eurofurence/types";

const initialSize = { width: Dimensions.get("window").width - 40, height: 160 };

export type ImageFillTarget = {
    x: number;
    y: number;
    size: number;
};

export type ImageFillProps = {
    /**
     * The style button.
     */
    style?: StyleProp<ViewStyle>;

    /**
     * The source image object.
     */
    image?: ImageDetails;

    /**
     * The targeted point and the dimension to make visible.
     */
    target?: ImageFillTarget;
};

export const ImageFill: FC<ImageFillProps> = ({ style, image, target }) => {
    const [size, setSize] = useState<{ width: number; height: number }>(initialSize);

    const arrangerStyle = useMemo<ViewStyle | null>(() => {
        if (!target) return null;

        const scale = Math.max(size.width, size.height) / target.size;
        return {
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            transform: [{ scale }],
        };
    }, [size.width, size.height, target?.size]);

    const imageStyle = useMemo<ImageProps["style"] | null>(() => {
        if (!image) return null;
        if (!target) return null;

        // Section, scale and translate around center.
        return {
            position: "absolute",
            left: 0,
            top: 0,
            width: image.Width,
            height: image.Height,
            transform: [{ translateX: size.width / 2 - target.x }, { translateY: size.height / 2 - target.y }],
        };
    }, [size.width, size.height, image?.Width, image?.Height, target?.x, target?.y]);

    return (
        <View style={[StyleSheet.absoluteFill, style]} onLayout={(e) => setSize(e.nativeEvent.layout)}>
            <Image style={StyleSheet.absoluteFill} contentFit="cover" blurRadius={20} source={image?.FullUrl} priority="normal" />
            <View style={arrangerStyle}>
                <Image style={imageStyle} contentFit="fill" contentPosition="top left" source={image?.FullUrl} priority="normal" />
            </View>
        </View>
    );
};
