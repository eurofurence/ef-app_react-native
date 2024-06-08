import { useCallback } from "react";
import { Linking } from "react-native";

import { appBase } from "../../configuration";
import { useAuthContext } from "../../context/AuthContext";

export const useFursuitGames = () => {
    const { accessToken } = useAuthContext();
    return useCallback(() => {
        if (accessToken === undefined) {
            alert("You are not logged in.");
            return;
        }
        Linking.openURL(`${appBase}/companion/#/login?embedded=false&returnPath=/collect&token=${accessToken}`).catch(console.error);
    }, [accessToken]);
};
