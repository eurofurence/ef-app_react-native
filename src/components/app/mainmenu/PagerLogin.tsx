import { FC } from "react";
import { StyleSheet, View } from "react-native";

import { LoginForm } from "../forms/login/LoginForm";

export const PagerLogin: FC<{ close: () => void }> = ({ close }) => {
    return (
        <View style={styles.container}>
            <LoginForm close={close} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 30,
    },
    marginAfter: {
        marginBottom: 16,
    },
    input: {
        width: "100%",
        borderBottomColor: "black",
        borderBottomWidth: 1,
        paddingVertical: 8,
    },
    marginBefore: {
        marginTop: 16,
    },
    rowLeft: {
        flex: 1,
        marginRight: 8,
    },
    rowRight: {
        flex: 1,
        marginLeft: 8,
    },
});
