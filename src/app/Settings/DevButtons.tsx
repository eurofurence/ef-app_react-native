import { useCallback, useEffect } from "react";
import { StyleSheet, Vibration, View } from "react-native";

import { Section } from "../../components/Atoms/Section";
import { Button } from "../../components/Containers/Button";
import { useAppSelector } from "../../store";
import { useCreateSyncRequestMutation, useSendPrivateMessageMutation } from "../../store/authorization.service";

export const DevButtons = () => {
    const [createSync] = useCreateSyncRequestMutation();
    const [sendMessage, message] = useSendPrivateMessageMutation();
    const me = useAppSelector((state) => state.authorization.uid);

    const onSendMessage = useCallback(() => {
        if (me === undefined) {
            alert("You are not logged in, not sending a message");
            return;
        }

        sendMessage({
            RecipientUid: me,
            AuthorName: "Eurofurence React Native Dev Menu",
            Subject: "You have won a grand prize!",
            Message: "You get to program more next year! ",
        });

        alert(`Sent a message to ${me}`);
    }, [me]);

    useEffect(() => {
        console.debug("Dev Buttons", message);
    }, [message]);

    return (
        <View>
            <Section title={"Dev Buttons"} subtitle={"Make the API do something"} />

            <Button
                icon={"warning"}
                containerStyle={styles.button}
                onPress={() => alert("Long hold to activate this function")}
                onLongPress={() => {
                    console.log("Forcing  FCM sync devices");
                    Vibration.vibrate(400);
                    createSync(undefined);
                    alert("Told all devices to synchronize");
                }}
            >
                Force ALL devices to sync via API (do not touch)
            </Button>

            <Button
                containerStyle={styles.button}
                onPress={() => {
                    onSendMessage();
                }}
            >
                Receive Private Message
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        marginVertical: 5,
    },
});
