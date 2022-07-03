import { useEffect, useState } from "react";
import { Image, Text } from "react-native";

import { withPlatform } from "../../hoc/withPlatform";
import { useGetImagesQuery } from "../../store/eurofurence.service";
import { EnrichedImageRecord } from "../../store/eurofurence.types";

export const CacheSynchronizer = () => {
    const [isCaching, setIsCaching] = useState(false);
    const [prefetchedImages, setPrefetchedImages] = useState(0);
    const images: Query<EnrichedImageRecord[]> = useGetImagesQuery(null, {});

    useEffect(() => {
        const fetchImages = async () => {
            if (images.data === undefined) {
                return;
            }
            const imageUrls = images.data.map((it) => it.ImageUrl);
            const cachedImages = await Image.queryCache(imageUrls);

            setPrefetchedImages(Object.keys(cachedImages).length);

            const nonCachedImages = imageUrls.filter((url) => !(url in cachedImages));

            await Promise.all(nonCachedImages.map((url) => Image.prefetch(url).then(() => setPrefetchedImages((c) => c + 1))));

            setIsCaching(false);
        };

        fetchImages();
    }, [images.data]);

    if (!isCaching) {
        return null;
    }

    return (
        <Text>
            We are prefetching images. We are currently at {prefetchedImages} out of {images.data?.length}
        </Text>
    );
};

export const PlatformCacheSynchronizer = withPlatform(CacheSynchronizer, ["android", "ios"]);
