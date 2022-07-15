import { useMemo } from "react";

import { EventRecord } from "../store/eurofurence.types";
import { useNow } from "./useNow";

export const useEventIsHappening = (event: Pick<EventRecord, "StartDateTimeUtc" | "EndDateTimeUtc">) => {
    const [now] = useNow();
    return useMemo(() => now.isBetween(event.StartDateTimeUtc, event.EndDateTimeUtc), [now, event]);
};
export const useEventIsDone = (event: Pick<EventRecord, "EndDateTimeUtc">) => {
    const [now] = useNow();
    return useMemo(() => now.isAfter(event.EndDateTimeUtc), [now, event]);
};
