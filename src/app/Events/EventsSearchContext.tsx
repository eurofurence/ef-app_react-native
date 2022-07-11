import { createContext } from "react";

import { EventRecord } from "../../store/eurofurence.types";

export type EventsSearchContextType = {
    search: string;
    setSearch: (results: string) => void;
    results: null | EventRecord[];
};

export const EventsSearchContext = createContext<EventsSearchContextType>({
    search: "",
    setSearch: () => undefined,
    results: null,
});
