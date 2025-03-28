import React, { useCallback, useState } from 'react';
import { View, TextInput, StyleSheet, Vibration } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDataCache } from '@/context/DataCacheProvider';
import { Button } from '@/components/generic/containers/Button';
import { captureException } from '@sentry/react-native';
import { useToast } from "@/context/ToastContext";
import { Section } from '@/components/generic/atoms/Section';
import * as Clipboard from 'expo-clipboard';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import { useThemeColorValue, useThemeBackground } from '@/hooks/themes/useThemeHooks';
import { useAuthContext } from '@/context/AuthContext';
import { useNow } from '@/hooks/time/useNow';
import { format } from 'date-fns';
import { useCreateSyncRequest, useSendPrivateMessage } from '@/services/auth';
import { withAlpha } from '@/context/Theme';

export function DevButtons() {
    const { t } = useTranslation("Settings", { keyPrefix: "dev_buttons" });
    const { synchronizeUi, saveCache } = useDataCache();
    const toast = useToast();
    const [token, setToken] = useState("");
    const { claims, refresh } = useAuthContext();
    const now = useNow(5000);

    const styleLighten = useThemeBackground("inverted");
    const styleText = useThemeBackground("text");
    const colorText = useThemeColorValue("text");

    // Auth service hooks
    const { execute: createSync, isLoading: isSyncing } = useCreateSyncRequest();
    const { execute: sendMessage, isLoading: isSending } = useSendPrivateMessage({
        RecipientUid: claims?.sub?.toString() || '',
        AuthorName: 'tester',
        ToastTitle: t("test_message_subject"),
        ToastMessage: t("test_message_content"),
        Subject: t("test_message_subject"),
        Message: t("test_message_content"),
    });

    const onSendMessage = useCallback(async () => {
        if (!claims) {
            alert(t("no_auth_alert"));
            return;
        }

        try {
            await sendMessage();
            alert(`Sent a message to ${claims.sub}`);
        } catch (error) {
            console.error('Failed to send message:', error);
            alert(t("send_message_error"));
        }
    }, [claims, sendMessage, t]);

    return (
        <View className="p-4">
            <Section title={t("title")} subtitle={t("subtitle")} />

            <Button 
                containerStyle={styles.button}
                onPress={() => toast("warning", "Toast " + format(now, 'HH:mm:ss'), 5000)}
                icon="toaster"
            >
                {t("test_toast")}
            </Button>

            <Button
                containerStyle={styles.button}
                onPress={async () => {
                    try {
                        const token = await Notifications.getDevicePushTokenAsync();
                        await Clipboard.setStringAsync(token.data);
                        toast("info", "Token copied to clipboard", 5000);
                    } catch (error) {
                        toast("warning", "Failed to get or copy token", 5000);
                        captureException(error);
                    }
                }}
                icon="file-key"
            >
                {t("copy_token")}
            </Button>

            <Button
                containerStyle={styles.button}
                onPress={async () => {
                    try {
                        await SecureStore.setItemAsync("accessToken", token);
                        await SecureStore.deleteItemAsync("refreshToken");
                        await refresh();
                    } catch (error) {
                        captureException(error);
                    }
                }}
                icon="key-variant"
            >
                {t("set_token")}
            </Button>

            <TextInput
                style={[styles.tokenField, styleLighten, styleText]}
                value={token}
                onChangeText={setToken}
                placeholder={t("token_placeholder")}
                placeholderTextColor={withAlpha(colorText, 0.6)}
                className="opacity-60"
            />

            <Button
                containerStyle={styles.button}
                onPress={() => {
                    saveCache("settings", "lastSynchronised", {
                        cid: "",
                        cacheVersion: "",
                        lastSynchronised: now.toISOString(),
                        state: {},
                        lastViewTimes: {}
                    });
                }}
                icon="timer-cog"
            >
                {t("overwrite_update_time")}
            </Button>

            <Button
                containerStyle={styles.button}
                onPress={() => synchronizeUi()}
                icon="refresh"
            >
                {t("sync_standard")}
            </Button>

            <Button
                containerStyle={styles.button}
                onPress={() => alert(t("sync_alert_error"))}
                onLongPress={async () => {
                    console.log("Forcing FCM sync devices");
                    Vibration.vibrate(400);
                    try {
                        await createSync();
                        alert(t("sync_alert_done"));
                    } catch (error) {
                        console.error('Sync failed:', error);
                        alert(t("sync_alert_error"));
                    }
                }}
                icon="alert"
            >
                {t("sync", { status: isSyncing ? "loading" : "ready" })}
            </Button>

            <Button
                containerStyle={styles.button}
                onPress={onSendMessage}
                icon="message-alert"
            >
                {t("send_private_message", { status: isSending ? "loading" : "ready" })}
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        marginVertical: 5,
    },
    tokenField: {
        marginHorizontal: 5,
        marginVertical: 15,
        borderRadius: 10,
        padding: 10,
    },
});