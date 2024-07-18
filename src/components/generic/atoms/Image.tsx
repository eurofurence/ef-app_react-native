import { Image as ExpoImage, ImageProps as ExpoImageProps } from "expo-image";
import { forwardRef } from "react";

import { onLoadEvent } from "../../../hooks/sync/useImagePrefetch";

export type ImageProps = ExpoImageProps;
export const Image = forwardRef<ExpoImage, ImageProps>((props, ref) => {
    return <ExpoImage onLoadStart={onLoadEvent} onLoadEnd={onLoadEvent} ref={ref} cachePolicy="memory-disk" priority="low" {...props} />;
});
