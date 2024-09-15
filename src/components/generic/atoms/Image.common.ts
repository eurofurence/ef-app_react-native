import { ImageSource } from "expo-image";
import { ImageRecord } from "../../../store/eurofurence/types";

/**
 * Converts a record to an image source.
 * @param image The image record to convert.
 */
export const sourceFromImage = (image: ImageRecord | null | undefined): ImageSource | null => {
    if (!image) return null;
    return {
        uri: image.Url,
        cacheKey: image.ContentHashSha1,
        width: image.Width,
        height: image.Height,
    };
};
