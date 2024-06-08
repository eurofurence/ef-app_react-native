import { useCallback, useMemo } from "react";

import { EventRecord } from "../../store/eurofurence.types";
import { useNow } from "../time/useNow";

/**
 * Uses a boolean that is true if the passed event is happening.
 * @param event The event, start and end need to be present.
 */
export const useEventIsHappening = (event: Pick<EventRecord, "StartDateTimeUtc" | "EndDateTimeUtc">) => {
    const now = useNow();
    return useMemo(() => now.isBetween(event.StartDateTimeUtc, event.EndDateTimeUtc), [now, event]);
};

/**
 * Uses a boolean that is true if the passed event is done.
 * @param event The event, start and end need to be present.
 */
export const useEventIsDone = (event: Pick<EventRecord, "EndDateTimeUtc">) => {
    const now = useNow();
    return useMemo(() => now.isAfter(event.EndDateTimeUtc), [now, event]);
};

/**
 * Returns a function that can check if a passed event is happening. This can be
 * used for example as a filter.
 */
export const useIsEventHappening = () => {
    const now = useNow();
    return useCallback((event: Pick<EventRecord, "StartDateTimeUtc" | "EndDateTimeUtc">) => now.isBetween(event.StartDateTimeUtc, event.EndDateTimeUtc), [now]);
};

/**
 * Returns a function that can check if a passed event is done. This can be used
 * for example as a filter.
 */
export const useIsEventDone = () => {
    const now = useNow();
    return useCallback((event: Pick<EventRecord, "StartDateTimeUtc" | "EndDateTimeUtc">) => now.isAfter(event.EndDateTimeUtc), [now]);
};
