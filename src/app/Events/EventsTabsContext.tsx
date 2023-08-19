import { createContext, FC, PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";

import { useAppSelector } from "../../store";
import { eventsSelector } from "../../store/eurofurence.selectors";
import { EventDetails } from "../../store/eurofurence.types";

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
    // Source of all events.
    const events = useAppSelector(eventsSelector.selectAll);

    // State of detail view selection.
    const [selected, setSelected] = useState<null | EventDetails>(null);

    // State of query and results.
    const [search, setSearch] = useState<string>("");
    const [results, setResults] = useState<null | EventDetails[]>(null);

    // Check if results are not empty.
    const hasResults = useMemo(() => (results?.length ?? 0) > 0, [results?.length]);

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
                    event.PanelHosts?.toLowerCase()?.includes(searchActual),
            );
            setResults(results);
        }, 100);

        return () => clearTimeout(handle);
    }, [events, search]);

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
