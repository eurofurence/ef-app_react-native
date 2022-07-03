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
        <View style={styles.container}>
            {whoAmI.isError ? <Text style={styles.title}>You are not logged in.</Text> : <Text style={styles.title}>Welcome back {whoAmI.data?.Username}</Text>}
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

const styles = StyleSheet.create({
    container: {
        width: 800,
        maxWidth: "95vw",
        marginVertical: 40,
        marginHorizontal: 20,
        display: "flex",
        gap: "20px",
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "left",
        flexGrow: 1,
    },
    button: {
        borderRadius: 5,
    },
});
