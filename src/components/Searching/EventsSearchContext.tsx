import { createContext, FC, useContext, useEffect, useMemo, useState } from "react";

import { useAppSelector } from "../../store";
import { eventsCompleteSelectors, EventWithDetails } from "../../store/eurofurence.selectors";

export type EventsSearchContextType = {
    search: string;
    setSearch: (results: string) => void;
    results: null | EventWithDetails[];
};

export const EventsSearchContext = createContext<EventsSearchContextType>({
    search: "",
    setSearch: () => undefined,
    results: null,
});

export const EventsSearchProvider: FC = ({ children }) => {
    // Source of all events.
    const events = useAppSelector(eventsCompleteSelectors.selectAll);

    // State of query and results.
    const [search, setSearch] = useState<string>("");
    const [results, setResults] = useState<null | EventWithDetails[]>(null);

    // Perform search.
    useEffect(() => {
        if (search.length < 3) {
            setResults(null);
            return;
        }

        const handle = setTimeout(() => {
            const searchActual = search.toLowerCase().trim();
            const results = events.filter(
                (event) =>
                    event.Title.toLowerCase().includes(searchActual) ||
                    event.SubTitle?.toLowerCase()?.includes(searchActual) ||
                    event.Abstract?.toLowerCase()?.includes(searchActual) ||
                    event.PanelHosts?.toLowerCase()?.includes(searchActual)
            );
            setResults(results);
        }, 100);

        return () => clearTimeout(handle);
    }, [events, search]);

    const context = useMemo<EventsSearchContextType>(
        () => ({
            search,
            setSearch,
            results,
        }),
        [search, setSearch, results]
    );

    return <EventsSearchContext.Provider value={context}>{children}</EventsSearchContext.Provider>;
};

export const useEventsSearchContext = () => useContext(EventsSearchContext);

export const useEventsSearchResults = () => useContext(EventsSearchContext).results;

export const useEventsSearchHasResults = () => useContext(EventsSearchContext).results !== null;

export const useEventsSearchQuery = () => useContext(EventsSearchContext).search;

export const useEventsSearchSetQuery = () => useContext(EventsSearchContext).setSearch;
