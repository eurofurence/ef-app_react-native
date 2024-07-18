import moment, { Moment } from "moment";
import { useEffect, useState } from "react";

import { useAppSelector } from "../../store";

/**
 * Returns the current time with a millisecond offset.
 * @param amount The ms offset.
 */
const nowWithOffset = (amount: number) => moment().add(amount, "millisecond");

/**
 * True if the values are equal in a given quantization.
 * @param a The first value.
 * @param b The second value.
 * @param resolution The resolution.
 */
const sameInResolution = (a: number, b: number, resolution: number) => Math.floor(a / resolution) === Math.floor(b / resolution);

/**
 * Get the current date, which includes time travelling.
 * @param resolution Static if not live. Otherwise, gives the minute hand
 * precision of the clock. Starts an interval, so use in central places only.
 */
export const useNow = (resolution: "static" | number = "static"): Moment => {
    const amount = useAppSelector((state) => (state.timetravel.enabled ? state.timetravel.amount : 0));

    const [now, setNow] = useState(() => nowWithOffset(amount));

    useEffect(() => {
        setNow(nowWithOffset(amount));
        if (resolution === "static") return;

        const handle = setInterval(
            () =>
                setNow((current) => {
                    const next = nowWithOffset(amount);
                    const currentMinutes = current.hours() * 60 + current.minutes();
                    const nextMinutes = next.hours() * 60 + next.minutes();
                    return sameInResolution(currentMinutes, nextMinutes, resolution) ? current : next;
                }),
            500,
        );
        return () => {
            clearInterval(handle);
        };
    }, [amount, resolution]);

    return now;
};
