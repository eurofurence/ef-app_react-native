import { Image, ImageProps } from "expo-image";
import * as React from "react";
import { FC, useMemo } from "react";
import { StyleSheet } from "react-native";

import { ImageDetails } from "../../store/eurofurence.types";

export type BannerProps = {
    /**
     * The style button.
     */
    style?: ImageProps["style"];

    /**
     * The source image object.
     */
    image?: ImageDetails;
};

export const Banner: FC<BannerProps> = ({ style, image }) => {
    // Do not render if nothing given.
    if (!image) return null;

    const aspect = useMemo<ImageProps["style"]>(() => (!image ? {} : { aspectRatio: image.Width / image.Height }), [image]);

    return <Image style={[styles.image, aspect, style]} contentFit={undefined} source={{ uri: image.FullUrl }} />;
};

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: undefined,
    },
});
