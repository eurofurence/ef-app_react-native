import { FC, useEffect, useMemo, useState } from "react";
import { Image, ImageProps, ImageStyle, ImageURISource } from "react-native";

export type AutoScaleImageProps = Omit<ImageProps, "source"> & {
    initialAspect?: number;
    source: ImageURISource | string;
};

/**
 * Provides image functionality that automatically scales to the image's real aspect ratio.
 * @constructor
 */
export const AutoScaleImage: FC<AutoScaleImageProps> = ({ style, initialAspect = 0.75, source, ...props }) => {
    const [aspect, setAspect] = useState<number>(initialAspect);

    useEffect(() => {
        const success = (width: number, height: number) => setAspect(width / height);
        const failure = () => setAspect(initialAspect);
        if (typeof source === "string") Image.getSize(source, success, failure);
        else if (source.uri && source.headers) Image.getSizeWithHeaders(source.uri, source.headers, success, failure);
        else if (source.uri) Image.getSize(source.uri, success, failure);
    }, [source]);

    const imageStyle = useMemo<ImageStyle>(() => ({ aspectRatio: aspect }), [aspect]);

    return <Image style={[style, imageStyle]} source={typeof source === "string" ? { uri: source } : source} {...props} />;
};
