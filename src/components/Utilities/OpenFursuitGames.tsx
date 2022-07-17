import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Text, View } from "react-native";

import { appBase } from "../../configuration";
import { useAppSelector } from "../../store";

export const OpenFursuitGames = () => {
    const token = useAppSelector((state) => state.authorization.token);

    useEffect(() => {
        WebBrowser.openBrowserAsync(`${appBase}/companion/#/login?embedded=false&returnPath=/collect&token=${token}`).catch(console.error);
    }, [token]);

    return (
        <View>
            <Text>We are opening a new browser screen</Text>
        </View>
    );
};
