import { useEffect, useState } from "react";

import { useNow } from "./useNow";

/**
 * Returns an interval slotted key of now. Live connected via interval.
 * @param interval The interval of minutes.
 */
export const useNowRefreshKey = (interval = 5) => {
    // Connect running timer.
    const [initialNow, getNow] = useNow();
    const [now, setNow] = useState(initialNow);
    useEffect(() => {
        const handle = setInterval(() => setNow(getNow()), 1000);
        return () => {
            clearInterval(handle);
        };
    }, []);

    // Get slotted key.
    const hourKey = now.hour();
    const minuteKey = Math.floor(now.minute() / interval) * interval;

    // Return comparable composite.
    return `${hourKey}:${minuteKey}`;
};
