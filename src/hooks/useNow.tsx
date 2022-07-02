import moment, { Moment } from "moment";
import { useMemo } from "react";

import { useAppSelector } from "../store";

/**
 * Get the current date, which includes time travelling.
 */
export const useNow = (): Moment => {
    const amount = useAppSelector((state) => (state.timetravel.enabled ? state.timetravel.amount : 0));

    return useMemo(() => {
        return moment().add(amount, "milliseconds");
    }, [amount]);
};
