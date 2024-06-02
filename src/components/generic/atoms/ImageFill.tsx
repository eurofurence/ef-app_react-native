import { Image, ImageProps } from "expo-image";
import * as React from "react";
import { FC, useCallback, useMemo, useState } from "react";
import { LayoutChangeEvent, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { ImageDetails } from "../../../store/eurofurence.types";

const initialSize = { width: 400, height: 300 };

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

    const onLayout = useCallback((e: LayoutChangeEvent) => setSize(e.nativeEvent.layout), []);

    const arrangerStyle = useMemo<ViewStyle>(() => {
        if (!target) return undefined!;

        const scale = Math.max(size.width, size.height) / target.size;

        return {
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            transform: [{ scale }],
        };
    }, [target]);

    const imageStyle = useMemo<ImageProps["style"]>(() => {
        if (!image) return undefined!;
        if (!target) return undefined!;
        if (!size) return undefined!;

        // Section, scale and translate around center.
        return {
            position: "absolute",
            left: 0,
            top: 0,
            width: image.Width,
            height: image.Height,
            transform: [{ translateX: size.width / 2 - target.x }, { translateY: size.height / 2 - target.y }],
        };
    }, [size, image, target]);

    const source = useMemo<ImageProps["source"]>(() => {
        if (!image) return undefined!;
        return { uri: image.FullUrl };
    }, [image]);

    return (
        <View style={[StyleSheet.absoluteFill, style]} onLayout={onLayout}>
            <View style={arrangerStyle}>
                <View style={imageStyle}>
                    <Image style={StyleSheet.absoluteFill} contentFit="fill" contentPosition="top left" source={source} />
                </View>
            </View>
        </View>
    );
};
