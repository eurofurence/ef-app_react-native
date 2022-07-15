import * as Device from "expo-device";
import { useMemo, useState } from "react";
import { Platform, View } from "react-native";

import { Label } from "../../components/Atoms/Label";
import { Section } from "../../components/Atoms/Section";

export const DeviceSpecificWarnings = () => {
    const [scheduledNotificications] = useState(() => Platform.OS === "android" || Platform.OS === "ios");
    const [cacheImages] = useState(() => Platform.OS === "android" || Platform.OS === "ios");
    const pushNotifications = useMemo(() => scheduledNotificications && Device.isDevice, [scheduledNotificications]);

    if (scheduledNotificications && pushNotifications && cacheImages) {
        // If we can do all things, do not return any warnings
        return null;
    }

    return (
        <View>
            <Section title={"Device Issues"} subtitle={"Due to your device some functionality might not work"} icon={"information"} />

            {!scheduledNotificications && <Label>Your device does not support scheduled notifications. You will not receive reminders about upcoming events.</Label>}
            {!pushNotifications && <Label>Your device does not support push notifications. You will not be automatically notified of Announcements or Private Messages.</Label>}
            {!cacheImages && <Label>Your device cannot cache images. Without an internet connection, images will not be shown.</Label>}
        </View>
    );
};
