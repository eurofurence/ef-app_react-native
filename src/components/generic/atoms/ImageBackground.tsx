import { ImageBackground as ExpoImageBackground, ImageBackgroundProps as ExpoImageBackgroundProps } from "expo-image";
import { forwardRef } from "react";

import { onLoadEvent } from "../../../hooks/sync/useImagePrefetch";

export type ImageBackgroundProps = ExpoImageBackgroundProps;
export const ImageBackground = forwardRef<ExpoImageBackground, ImageBackgroundProps>((props, ref) => {
    return <ExpoImageBackground onLoadStart={onLoadEvent} onLoadEnd={onLoadEvent} ref={ref} cachePolicy="memory-disk" priority="low" {...props} />;
});
