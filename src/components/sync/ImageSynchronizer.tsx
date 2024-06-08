import { captureException } from "@sentry/react-native";
import { Image } from "expo-image";
import { isEqual } from "lodash";
import { useEffect, useState } from "react";
import { Text } from "react-native";

import { useAppSelector } from "../../store";
import { imagesSelectors } from "../../store/eurofurence.selectors";

export const ImageSynchronizer = () => {
    const [isCaching, setIsCaching] = useState(false);
    const images = useAppSelector(imagesSelectors.selectAll, isEqual);

    useEffect(() => {
        setIsCaching(true);
        Image.prefetch(images.map((it) => it.FullUrl)).catch(captureException);
        setIsCaching(false);
    }, [images]);

    if (!isCaching) {
        return null;
    }

    return <Text>Images are now fetching in the background.</Text>;
};
