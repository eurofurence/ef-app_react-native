import { FC, useMemo, useState } from "react";
import * as React from "react";
import { Image, ImageStyle, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { ImageDetails } from "../../store/eurofurence.types";

const initialSize = { width: 400, height: 300 };

export type ImageExTarget = {
    x: number;
    y: number;
    size: number;
};

export type ImageExProps = {
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
    target?: ImageExTarget;
};

export const ImageEx: FC<ImageExProps> = ({ style, image, target }) => {
    const [size, setSize] = useState<{ width: number; height: number }>(initialSize);

    const arrangerStyle = useMemo<ViewStyle>(() => {
        if (!target) return StyleSheet.absoluteFillObject;

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

    const imageStyle = useMemo<ImageStyle>(() => {
        if (!image) return {};

        // Unscaled if no section given.
        if (!target) {
            return {
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                resizeMode: "cover",
            };
        }

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

    // Do not render if nothing given.
    if (!image) return null;

    return (
        <View style={[StyleSheet.absoluteFill, style]} onLayout={(e) => setSize(e.nativeEvent.layout)}>
            <View style={arrangerStyle}>
                <Image style={imageStyle} resizeMode={undefined} source={{ uri: image.FullUrl }} />
            </View>
        </View>
    );
};
