import { captureException } from "@sentry/react-native";
import { Image } from "expo-image";
import { useEffect } from "react";

import { useAppSelector } from "../../store";
import { imagesSelectors } from "../../store/eurofurence/selectors/records";

export const useImagePrefetch = () => {
    const images = useAppSelector(imagesSelectors.selectAll);
    useEffect(() => {
        Image.prefetch(images.map((it) => it.FullUrl)).catch(captureException);
    }, [images]);
};
