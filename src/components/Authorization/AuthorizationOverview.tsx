import { Text, View } from "react-native";

import { useAppSelector } from "../../store";
import { useGetWhoAmIQuery } from "../../store/authorization.service";

export const AuthorizationOverview = () => {
    const loggedIn = useAppSelector((state) => state.authorization.isLoggedIn);
    const username = useAppSelector((state) => state.authorization.username);
    const whoAmI = useGetWhoAmIQuery();

    if (whoAmI.isUninitialized) {
        return null;
    }

    return (
        <View>
            {loggedIn ? (
                <Text style={{ fontSize: 25, fontWeight: "bold" }}>Welcome back {username}</Text>
            ) : (
                <Text style={{ fontSize: 25, fontWeight: "bold" }}>You are not logged in.</Text>
            )}
        </View>
    );
};
