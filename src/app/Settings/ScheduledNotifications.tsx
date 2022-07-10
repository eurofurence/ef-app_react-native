import { isDevice } from "expo-device";
import { getAllScheduledNotificationsAsync, NotificationRequest } from "expo-notifications";
import moment from "moment";
import { useEffect, useState } from "react";
import { View } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";
import { withPlatform } from "../../hoc/withPlatform";

/**
 * Shows all scheduled notifications
 * @constructor
 */
export const ScheduledNotifications = () => {
    const [notifications, setNotifications] = useState<NotificationRequest[]>([]);

    useEffect(() => {
        if (!isDevice) {
            return;
        }
        getAllScheduledNotificationsAsync().then((n) => setNotifications(n));
    }, []);

    return (
        <View>
            <Section title={"Notifications"} subtitle={"All scheduled notifications on this device"} icon={"notifications"} />

            {notifications.map((item) => (
                <Label key={item.identifier} mb={15}>{`${item.identifier} scheduled on ${moment(item.trigger?.value).format("llll")}`}</Label>
            ))}
        </View>
    );
};

export const PlatformScheduledNotifications = withPlatform(ScheduledNotifications, ["android", "ios"]);
