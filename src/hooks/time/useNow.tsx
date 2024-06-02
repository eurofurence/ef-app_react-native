import moment, { Moment } from "moment";
import { useCallback, useMemo } from "react";

import { useAppSelector } from "../../store";

/**
 * Get the current date, which includes time travelling.
 */
export const useNow = (): [Moment, () => Moment] => {
    const amount = useAppSelector((state) => (state.timetravel.enabled ? state.timetravel.amount : 0));

    const getNow = useCallback(() => moment().add(amount, "millisecond"), [amount]);
    const now = useMemo(() => getNow(), [getNow]);

    return [now, getNow];
};
