import { isEqual } from "lodash";
import { useState } from "react";

/**
 * Uses a stable version of the object or array.
 * @param object
 */
export const useStable = <T>(object: T): T => {
    const [value, setValue] = useState(object);
    if (!isEqual(value, object)) setValue(object);
    return value;
};
