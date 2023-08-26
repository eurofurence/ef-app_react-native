import Fuse from "fuse.js";
import { createContext, FC, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

import { useFuseFor } from "../../hooks/useFuseFor";
import { eventsSelector } from "../../store/eurofurence.selectors";
import { EventDetails } from "../../store/eurofurence.types";

const eventSearchProperties: Fuse.FuseOptionKey<EventDetails>[] = [
    {
        name: "Title",
        weight: 2,
    },
    {
        name: "SubTitle",
        weight: 1,
    },
    {
        name: "Abstract",
        weight: 0.5,
    },
    {
        name: "PanelHosts",
        weight: 0.1,
    },
];

const eventSearchOptions: Fuse.IFuseOptions<EventDetails> = {
    shouldSort: true,
    threshold: 0.3,
};

export type EventsTabsContextType = {
    selected: null | EventDetails;
    setSelected: (event: null | EventDetails) => void;
    search: string;
    setSearch: (results: string) => void;
    results: null | EventDetails[];
    hasResults: boolean;
};

export const EventsTabsContext = createContext<EventsTabsContextType>({
    selected: null,
    setSelected: () => undefined,
    search: "",
    setSearch: () => undefined,
    results: null,
    hasResults: false,
});

export const EventsTabsContextProvider: FC<PropsWithChildren> = ({ children }) => {
    // Create indexer.
    const fuse = useFuseFor(eventsSelector.selectAll, eventSearchProperties, eventSearchOptions);

    // State of detail view selection.
    const [selected, setSelected] = useState<null | EventDetails>(null);

    // State of query and results.
    const [search, setSearch] = useState<string>("");
    const [results, setResults] = useState<null | EventDetails[]>(null);

    // Check if results are not empty.
    const hasResults = useMemo(() => (results?.length ?? 0) > 0, [results?.length]);

    // Perform search.
    useEffect(() => {
        const handle = setTimeout(() => {
            setResults(fuse.search(search, { limit: 10 }).map((result) => result.item));
        }, 60);

        return () => clearTimeout(handle);
    }, [fuse, search]);

    const context = useMemo<EventsTabsContextType>(
        () => ({
            selected,
            setSelected,
            search,
            setSearch,
            results,
            hasResults,
        }),
        [selected, setSelected, search, setSearch, results, hasResults],
    );

    return <EventsTabsContext.Provider value={context}>{children}</EventsTabsContext.Provider>;
};

export const useEventsTabsContext = () => useContext(EventsTabsContext);
