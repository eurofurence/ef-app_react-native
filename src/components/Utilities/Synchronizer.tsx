import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../store";
import { applySync } from "../../store/eurofurence.cache";

const INITIAL_START_TIMEOUT = 100;

export const Synchronizer = () => {
    const dispatch = useAppDispatch();
    const lastFetch = useAppSelector((state) => state.eurofurenceCache.lastSynchronised);

    useEffect(() => {
        const sync = async () => {
            await setTimeout(async () => {
                console.debug("Synchronizer", "Starting synchronization", lastFetch);
                const result = await fetch(`https://app.eurofurence.org/EF26/Api/Sync?since=${lastFetch}`);

                console.debug("Synchronizer", "Retrieved sync contents");
                const content = await result.json();

                dispatch(applySync(content));
                console.debug("Synchronizer", "All done");
            }, INITIAL_START_TIMEOUT);
        };

        sync();
    }, []);

    return null;
};
