import { captureException } from "@sentry/react-native";
import { Image } from "expo-image";
import { useEffect } from "react";

import { useAppSelector } from "../../store";
import { imagesSelectors } from "../../store/eurofurence/selectors/records";
import { Observable } from "../../util/Observable";
import { ResettableTimeout } from "../../util/ResettableTimeout";

/**
 * Resettable timeout waiting for load completion.
 */
export const imagePrefetchGate = new ResettableTimeout(10_000);

/**
 * Completion state.
 */
export const imagePrefetchComplete = new Observable(false);

/**
 * Invoke when a load event is triggered on an image, pushes the prefetch
 * back to allow for priority images to load.
 */
export const onLoadEvent = () => imagePrefetchGate.reset();

export const useImagePrefetch = () => {
    const images = useAppSelector(imagesSelectors.selectAll);
    useEffect(() => {
        // Schedule after cooldown.
        console.log("Scheduling prefetch");

        // Reset completion, images might have changed.
        imagePrefetchComplete.value = false;
        imagePrefetchGate.setHandle(() => {
            // Log that gate let trigger through.
            console.log("Prefetch triggered");

            // Start the prefetch.
            Image.prefetch(
                images.map((it) => it.FullUrl),
                "memory-disk",
            )
                .catch(captureException)
                .finally(() => {
                    // Mark disconnect.
                    console.log("Completed, disconnecting");

                    // Completed, deactivate gate's connection to the handler
                    // and set completion to true.
                    imagePrefetchGate.clearHandle();
                    imagePrefetchComplete.value = true;
                });
        });

        return () => {
            // Hook not used anymore, disconnect handler.
            imagePrefetchGate.clearHandle();
        };
    }, [images]);
};
