import { debounce } from "lodash";
import { Platform } from "react-native";

/**
 * Debounces the function only on Android.
 * @param func The function to debounce
 * @param wait The wait time if debouncing.
 */
export const debounceOnAndroid = <T extends (...args: any) => any>(func: T, wait: number = 1000) => {
    if (Platform.OS === "ios") return func;
    else return debounce(func, wait, { leading: false, trailing: false });
};
