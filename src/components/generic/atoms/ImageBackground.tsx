import { ImageBackground as ExpoImageBackground, ImageBackgroundProps as ExpoImageBackgroundProps } from "expo-image";
import { forwardRef } from "react";

import { onLoadEvent } from "../../../hooks/sync/useImagePrefetch";

export type ImageBackgroundProps = ExpoImageBackgroundProps;
export const ImageBackground = forwardRef<typeof ExpoImageBackground, ImageBackgroundProps>((props, ref) => {
    // @ts-expect-error: ref type is not correct
    return <ExpoImageBackground ref={ref} onLoadStart={onLoadEvent} onLoadEnd={onLoadEvent} cachePolicy="memory-disk" priority="low" {...props} />;
});
