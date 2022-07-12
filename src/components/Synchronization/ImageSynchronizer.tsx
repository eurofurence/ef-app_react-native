import { useEffect, useState } from "react";
import { Image, Text } from "react-native";

import { withPlatform } from "../../hoc/withPlatform";
import { useAppSelector } from "../../store";
import { imagesSelectors } from "../../store/eurofurence.selectors";

export const ImageSynchronizer = () => {
    const [isCaching, setIsCaching] = useState(false);
    const [prefetchedImages, setPrefetchedImages] = useState(0);
    const images = useAppSelector(imagesSelectors.selectAll);

    useEffect(() => {
        const fetchImages = async () => {
            const imageUrls = images.map((it) => it.ImageUrl).filter((it): it is string => it !== undefined);
            // @ts-expect-error this method seemingly might not exist?
            const cachedImages = await Image.queryCache(imageUrls);

            setPrefetchedImages(Object.keys(cachedImages).length);

            const nonCachedImages = imageUrls.filter((url) => !(url in cachedImages));

            await Promise.all(nonCachedImages.map((url) => Image.prefetch(url).then(() => setPrefetchedImages((c) => c + 1))));

            setIsCaching(false);
        };

        fetchImages().catch(console.error);
    }, [images]);

    if (!isCaching) {
        return null;
    }

    return (
        <Text>
            We are prefetching images. We are currently at {prefetchedImages} out of {images.length}
        </Text>
    );
};

export const PlatformImageSynchronizer = withPlatform(ImageSynchronizer, ["android", "ios"]);
