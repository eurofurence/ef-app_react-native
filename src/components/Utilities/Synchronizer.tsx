import { useTimeout } from "usehooks-ts";

import { useAppDispatch, useAppSelector } from "../../store";
import { applySync } from "../../store/eurofurence.cache";

const INITIAL_START_TIMEOUT = 100;

export const Synchronizer = () => {
    const dispatch = useAppDispatch();
    const lastFetch = useAppSelector((state) => state.eurofurenceCache.lastSynchronised);

    useTimeout(async () => {
        console.debug("Synchronizer", "Starting synchronization", lastFetch);
        const result = await fetch(`https://app.eurofurence.org/EF26/Api/Sync?since=${lastFetch}`);

        console.debug("Synchronizer", "Retrieved sync contents");
        const content = await result.json();

        dispatch(applySync(content));
        console.debug("Synchronizer", "All done");
    }, INITIAL_START_TIMEOUT);

    return null;
};
