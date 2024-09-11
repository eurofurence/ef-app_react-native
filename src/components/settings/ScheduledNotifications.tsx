import { isDevice } from "expo-device";
import { getAllScheduledNotificationsAsync, NotificationRequest } from "expo-notifications";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Label } from "../generic/atoms/Label";
import { Section } from "../generic/atoms/Section";
import { useAppSelector } from "../../store";
import { eventsSelector } from "../../store/eurofurence/selectors/records";
import { Col } from "../generic/containers/Col";
import { selectEventReminders } from "../../store/background/selectors";

/**
 * Shows all scheduled notifications
 * @constructor
 */
export const ScheduledNotifications = () => {
    const { t } = useTranslation("Settings", { keyPrefix: "notifications" });

    const reminders = useAppSelector(selectEventReminders);
    const events = useAppSelector(eventsSelector.selectEntities);

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
            {!reminders.length && <Label mb={15}>{t("no_notifications")}</Label>}

            <Col gap={10}>
                {reminders.map((item) => (
                    <Col key={item.recordId}>
                        <Label type="h4">{events?.[item.recordId]?.Title ?? item.recordId}</Label>
                        <Label ml={15}>{t("scheduled_at", { time: moment.utc(item.dateCreatedUtc).format("llll") })}</Label>
                        <Label ml={15}>{t("scheduled_for", { time: moment.utc(item.dateScheduledUtc).format("llll") })}</Label>
                        <Label ml={15}>
                            {notifications.find((notification) => notification.identifier === item.recordId) ? t("is_device_scheduled") : t("is_not_device_scheduled")}
                        </Label>
                    </Col>
                ))}
            </Col>
        </View>
    );
};
