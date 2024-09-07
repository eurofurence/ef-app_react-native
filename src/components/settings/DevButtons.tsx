import { useIsFocused } from "@react-navigation/core";
import moment from "moment-timezone";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Vibration, View } from "react-native";
import * as Clipboard from "expo-clipboard";
import * as Notifications from "expo-notifications";

import { captureException } from "@sentry/react-native";
import { useAuthContext } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
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
    const { claims } = useAuthContext();
    const { synchronizeUi } = useSynchronizer();
    const toast = useToast();

    const dispatch = useAppDispatch();
    const isFocused = useIsFocused();
    const now = useNow(isFocused ? 5 : "static");

    const onSendMessage = useCallback(() => {
        if (!claims) {
            alert(t("no_auth_alert"));
            return;
        }

        sendMessage({
            RecipientUid: claims.sub as string,
            AuthorName: `tester`,
            Subject: t("test_message_subject"),
            Message: t("test_message_content"),
        });

        alert(`Sent a message to ${claims.sub}`);
    }, [claims, sendMessage, t]);

    return (
        <View>
            <Section title={t("title")} subtitle={t("subtitle")} />

            <Button containerStyle={styles.button} icon="toaster" onPress={() => toast("warning", "Toast " + moment().format(), 5000)}>
                Test toasts
            </Button>
            <Button
                containerStyle={styles.button}
                icon="file-key"
                onPress={() => {
                    // Copy device token to clipboard if it can be acquired.
                    Notifications.getDevicePushTokenAsync()
                        .then((token) => Clipboard.setStringAsync(token.data))
                        .then(() => {
                            toast("info", "Token copied to clipboard", 5000);
                        })
                        .catch((error) => {
                            toast("warning", "Failed to get or copy token", 5000);
                            captureException(error);
                        });
                }}
            >
                Copy native Messaging token
            </Button>
            <Button containerStyle={styles.button} icon="refresh" onPress={() => dispatch(overwriteUpdateTimes(now.toISOString()))}>
                {t("overwrite_update_time")}
            </Button>
            <Button containerStyle={styles.button} icon="refresh" onPress={() => synchronizeUi()}>
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
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        marginVertical: 5,
    },
});
