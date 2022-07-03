import { Button, StyleSheet, Text, View } from "react-native";

import { useAppDispatch } from "../../store";
import { useGetWhoAmIQuery, usePostTokenMutation } from "../../store/authorization.service";
import { logout } from "../../store/authorization.slice";

export const AuthorizationOverview = () => {
    const dispatch = useAppDispatch();
    const whoAmI = useGetWhoAmIQuery();
    const [login] = usePostTokenMutation();

    if (whoAmI.isUninitialized) {
        return null;
    }

    return (
        <View>
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>Authorization</Text>
            {whoAmI.isError ? (
                <Text style={{ fontSize: 25, fontWeight: "bold" }}>You are not logged in.</Text>
            ) : (
                <Text style={{ fontSize: 25, fontWeight: "bold" }}>Welcome back {whoAmI.data?.Username}</Text>
            )}
            <Button
                title={whoAmI.isSuccess ? "Click here to log out." : "Log in as reviewer"}
                onPress={() => {
                    if (whoAmI.isSuccess) {
                        dispatch(logout());
                        whoAmI.refetch();
                    } else {
                        login({
                            RegNo: 99999,
                            Username: "reviewer",
                            Password: "540159",
                        });
                    }
                }}
            />
        </View>
    );
};
