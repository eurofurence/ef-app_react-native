import { useIsFocused } from "@react-navigation/core";
import { captureException } from "@sentry/react-native";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Vibration, View } from "react-native";

import { useAuthContext } from "../../context/AuthContext";
import { useNow } from "../../hooks/time/useNow";
import { useAppDispatch } from "../../store";
import { useCreateSyncRequestMutation, useSendPrivateMessageMutation } from "../../store/auth/service";
import { overwriteUpdateTimes } from "../../store/eurofurence/slice";
import { Section } from "../generic/atoms/Section";
import { Button } from "../generic/containers/Button";
import { useSynchronizer } from "../sync/SynchronizationProvider";

export const DevButtons = () => {
    const { t } = useTranslation("Settings", { keyPrefix: "dev_buttons" });
    const [createSync, syncResult] = useCreateSyncRequestMutation();
    const [sendMessage, messageResult] = useSendPrivateMessageMutation();
    const { user, logout } = useAuthContext();
    const { synchronize } = useSynchronizer();

    const dispatch = useAppDispatch();
    const isFocused = useIsFocused();
    const now = useNow(isFocused ? 5 : "static");

    const onSendMessage = useCallback(() => {
        if (!user) {
            alert(t("no_auth_alert"));
            return;
        }

        sendMessage({
            RecipientUid: user.sub as string,
            AuthorName: `tester`,
            Subject: t("test_message_subject"),
            Message: t("test_message_content"),
        });

        alert(`Sent a message to ${user}`);
    }, [user]);

    return (
        <View>
            <Section title={t("title")} subtitle={t("subtitle")} />

            <Button containerStyle={styles.button} icon="refresh" onPress={() => dispatch(overwriteUpdateTimes(now.toISOString()))}>
                {t("overwrite_update_time")}
            </Button>
            <Button containerStyle={styles.button} icon="refresh" onPress={() => synchronize()}>
                {t("sync_standard")}
            </Button>
            <Button
                containerStyle={styles.button}
                icon="alert"
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
                containerStyle={styles.button}
                icon="message-alert"
                onPress={() => {
                    onSendMessage();
                }}
            >
                {t("send_private_message", { status: messageResult.status })}
            </Button>

            {/* TODO: We should have a proper button for this. */}
            <Button
                containerStyle={styles.button}
                onPress={() => {
                    logout().catch(captureException);
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
