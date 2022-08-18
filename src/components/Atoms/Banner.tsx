import { FC, useMemo } from "react";
import * as React from "react";
import { Image, ImageStyle, StyleProp, StyleSheet } from "react-native";

import { ImageDetails } from "../../store/eurofurence.types";

export type BannerProps = {
    /**
     * The style button.
     */
    style?: StyleProp<ImageStyle>;

    /**
     * The source image object.
     */
    image?: ImageDetails;
};

export const Banner: FC<BannerProps> = ({ style, image }) => {
    // Do not render if nothing given.
    if (!image) return null;

    const aspect = useMemo<ImageStyle>(() => (!image ? {} : { aspectRatio: image.Width / image.Height }), [image]);

    return <Image style={[styles.image, aspect, style]} resizeMode={undefined} source={{ uri: image.FullUrl }} />;
};

const styles = StyleSheet.create({
    image: {
        width: "100%",
        height: undefined,
    },
});
