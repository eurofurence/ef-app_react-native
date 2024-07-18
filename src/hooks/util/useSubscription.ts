import { useEffect, useState } from "react";

export function useSubscription<T>(value: T, subscribe: (fn: (value: T) => void) => () => void) {
    const [state, setState] = useState(value);
    useEffect(() => {
        const unsubscribe = subscribe((value) => setState(value));
        return () => {
            unsubscribe();
        };
    }, []);

    return state;
}
