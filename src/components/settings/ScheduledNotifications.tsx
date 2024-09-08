import { isDevice } from "expo-device";
import { getAllScheduledNotificationsAsync, NotificationRequest } from "expo-notifications";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Label } from "../generic/atoms/Label";
import { Section } from "../generic/atoms/Section";

/**
 * Shows all scheduled notifications
 * @constructor
 */
export const ScheduledNotifications = () => {
    const { t } = useTranslation("Settings", { keyPrefix: "notifications" });
    const [notifications, setNotifications] = useState<NotificationRequest[]>([]);

    useEffect(() => {
        if (!isDevice) {
            return;
        }
        getAllScheduledNotificationsAsync().then((n) => setNotifications(n));
    }, []);

    return (
        <View>
            <Section title={t("title")} subtitle={t("subtitle")} icon="notification-clear-all" />
            {!notifications.length && <Label mb={15}>{t("no_notifications")}</Label>}

            {notifications.map((item) => (
                <Label key={item.identifier} mb={15}>
                    {/* @ts-expect-error Value does not really exist yet */}
                    {t("notification_item", { identifier: item.identifier, time: moment(item.trigger?.value).format("llll") })}
                </Label>
            ))}
        </View>
    );
};
