import { createContext, FC, PropsWithChildren, useContext, useState } from "react";

import { EventDetails } from "../../store/eurofurence.types";

export type EventsRouterContextType = {
    selected: null | EventDetails;
    setSelected: (event: null | EventDetails) => void;
};

export const EventsRouterContext = createContext<EventsRouterContextType>({
    selected: null,
    setSelected: () => undefined,
});

export const EventsRouterContextProvider: FC<PropsWithChildren> = ({ children }) => {
    // State of detail view selection.
    const [selected, setSelected] = useState<null | EventDetails>(null);

    return <EventsRouterContext.Provider value={{ selected, setSelected }}>{children}</EventsRouterContext.Provider>;
};

export const useEventsRouterContext = () => useContext(EventsRouterContext);
