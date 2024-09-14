import { DependencyList, useMemo } from "react";
import { debounce } from "lodash";

export const useDebounce = (callback: () => void, deps: DependencyList): (() => void) => {
    return useMemo(() => debounce(callback, 1000, { leading: true, trailing: false }), deps);
};
