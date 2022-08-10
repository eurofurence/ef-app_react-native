import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Vibration, View } from "react-native";

import { Section } from "../../components/Atoms/Section";
import { Button } from "../../components/Containers/Button";
import { useAppDispatch, useAppSelector } from "../../store";
import { useCreateSyncRequestMutation, useSendPrivateMessageMutation } from "../../store/authorization.service";
import { logout } from "../../store/authorization.slice";

export const DevButtons = () => {
    const dispatch = useAppDispatch();
    const { t } = useTranslation("Settings", { keyPrefix: "dev_buttons" });
    const [createSync, syncResult] = useCreateSyncRequestMutation();
    const [sendMessage, messageResult] = useSendPrivateMessageMutation();
    const me = useAppSelector((state) => state.authorization.uid);

    const onSendMessage = useCallback(() => {
        if (me === undefined) {
            alert(t("no_auth_alert"));
            return;
        }

        sendMessage({
            RecipientUid: me,
            AuthorName: `tester`,
            Subject: t("test_message_subject"),
            Message: t("test_message_content"),
        });

        alert(`Sent a message to ${me}`);
    }, [me]);
    const onLogout = useCallback(() => {
        dispatch(logout());
    }, []);
    return (
        <View>
            <Section title={t("title")} subtitle={t("subtitle")} />

            <Button
                icon="alert"
                style={styles.button}
                onPress={() => alert(t("sync_alert_error"))}
                onLongPress={() => {
                    console.log("Forcing  FCM sync devices");
                    Vibration.vibrate(400);
                    createSync(undefined);
                    alert(t("sync_alert_done"));
                }}
            >
                {t("sync", { status: syncResult.status })}
            </Button>

            <Button
                style={styles.button}
                onPress={() => {
                    onSendMessage();
                }}
            >
                {t("send_private_message", { status: messageResult.status })}
            </Button>

            {/* TODO: We should have a proper button for this. */}
            <Button
                style={styles.button}
                onPress={() => {
                    onLogout();
                }}
            >
                Logout
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        marginVertical: 5,
    },
});
