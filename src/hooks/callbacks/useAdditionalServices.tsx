import { useCallback } from "react";
import { Linking } from "react-native";

import { appBase } from "../../configuration";
import { useAppSelector } from "../../store";

export const useAdditionalServices = () => {
    const token = useAppSelector((state) => state.authorization.token);

    return useCallback(() => {
        if (token === undefined) {
            alert("You are not logged in.");
            return;
        }
        Linking.openURL(`${appBase}/companion/#/login?embedded=false&returnPath=/&token=${token}`).catch(console.error);
    }, [token]);
};
