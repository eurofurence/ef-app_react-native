import { useIsFocused } from "@react-navigation/core";
import { createContext, FC, useCallback, useContext, useEffect, useMemo, useState } from "react";

/**
 * Type for the context.
 */
export type LoadingContextType = {
    /**
     * Indicates this ID is now loading.
     * @param id
     */
    indicateLoading(id: string): void;

    /**
     * Indicates this ID is now done.
     * @param id
     */
    indicateDone(id: string): void;

    /**
     * True if the context is loading.
     */
    isLoading: boolean;
};

/**
 * A global loading tracker.
 */
export const LoadingContext = createContext<LoadingContextType>({
    indicateLoading: () => console.error("No loading context configured."),
    indicateDone: () => console.error("No loading context configured."),
    isLoading: false,
});

/**
 * Provides a loading tracker.
 * @param children The children to provide for.
 * @constructor
 */
export const LoadingContextProvider: FC = ({ children }) => {
    // Array of active IDs.
    const [active, setActive] = useState<string[]>([]);

    // Add ID if not present.
    const indicateLoading = useCallback((id: string) => {
        setActive((prevState) => (prevState.includes(id) ? prevState : prevState.concat(id)));
    }, []);

    // Remove ID if present.
    const indicateDone = useCallback((id: string) => {
        setActive((prevState) => prevState.filter((other) => other !== id));
    }, []);

    // True if not empty.
    const isLoading = Boolean(active.length);

    // Convert to a context object.
    const context = useMemo(() => ({ indicateLoading, indicateDone, isLoading }), [indicateLoading, indicateDone, isLoading]);

    return <LoadingContext.Provider value={context}>{children}</LoadingContext.Provider>;
};

export const useIsLoading = () => useContext(LoadingContext).isLoading;

export const useSignalLoading = (value: boolean, inBackground: boolean = false) => {
    const [id] = useState(() => Math.random().toString());
    const context = useContext(LoadingContext);
    const focused = useIsFocused();

    useEffect(() => {
        if ((inBackground || focused) && value) {
            context.indicateLoading(id);
            return () => context.indicateDone(id);
        } else {
            context.indicateDone(id);
        }
    }, [id, context, value, inBackground, focused]);
};
