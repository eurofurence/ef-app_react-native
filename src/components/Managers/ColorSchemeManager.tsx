import { useEffect } from "react";
import { useColorScheme } from "react-native";

import { useAppDispatch } from "../../store";
import { setColorScheme } from "../../store/settings.slice";

export const ColorSchemeManager = () => {
    const dispatch = useAppDispatch();
    const colorScheme = useColorScheme();
    useEffect(() => {
        dispatch(setColorScheme(colorScheme));
    }, [dispatch, colorScheme]);

    return null;
};
