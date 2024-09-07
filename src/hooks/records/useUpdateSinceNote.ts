import moment from "moment/moment";
import { useEffect, useMemo } from "react";

import { useAppDispatch, useAppSelector } from "../../store";
import { selectLastViewedUtc } from "../../store/auxiliary/selectors";
import { setViewed } from "../../store/auxiliary/slice";
import { RecordMetadata } from "../../store/eurofurence/types";
import { useNow } from "../time/useNow";

/**
 * Gets the last viewed time of this record and if the record has changed
 * since, returns true. Also connects setting the viewed time of the item after
 * a delay.
 * @param item The item or null or undefined if not yet loaded.
 * @param delay The delay before setting as viewed.
 */
export const useUpdateSinceNote = (item: RecordMetadata | null | undefined, delay = 3_000) => {
    const now = useNow();
    const dispatch = useAppDispatch();
    const lastViewed = useAppSelector((state) => (item ? selectLastViewedUtc(state, item.Id) : null));
    const updated = useMemo(() => Boolean(item && lastViewed && moment.utc(item.LastChangeDateTimeUtc).isAfter(lastViewed)), [item, lastViewed]);

    useEffect(() => {
        if (!item) return;

        const handle = setTimeout(() => {
            dispatch(setViewed({ id: item.Id, nowUtc: now.clone().utc().format() }));
        }, delay);
        return () => {
            clearTimeout(handle);
        };
    }, [item, dispatch, now, delay]);

    return updated;
};
