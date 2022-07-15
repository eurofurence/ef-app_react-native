import { useMemo } from "react";

import { EventRecord } from "../store/eurofurence.types";
import { useNow } from "./useNow";

export const useEventIsHappening = (event: EventRecord) => {
    const [now] = useNow();
    return useMemo(() => now.isBetween(event.StartDateTimeUtc, event.EndDateTimeUtc), [now, event]);
};
export const useEventIsDone = (event: EventRecord) => {
    const [now] = useNow();
    return useMemo(() => now.isAfter(event.EndDateTimeUtc), [now, event]);
};
