import * as WebBrowser from "expo-web-browser";
import { useCallback } from "react";

import { useAppSelector } from "../store";

export const useFursuitGames = () => {
    const token = useAppSelector((state) => state.authorization.token);
    const open = useCallback(() => {
        if (token === undefined) {
            alert("You are not logged in.");
            return;
        }
        WebBrowser.openBrowserAsync(`https://app.eurofurence.org/EF26/companion/#/login?embedded=false&returnPath=/collect&token=${token}`).catch(console.error);
    }, [token]);

    return open;
};
