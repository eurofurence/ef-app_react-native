import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Platform } from "react-native";

import { withPlatform } from "../../hoc/withPlatform";
import { useAppSelector } from "../../store";
import { usePostDeviceRegistrationMutation } from "../../store/authorization.service";

export const NotificationManager = () => {
    const [registerDevice] = usePostDeviceRegistrationMutation();
    const [expoPushToken, setExpoPushToken] = useState("");
    const token = useAppSelector((state) => state.authorization.token);

    useEffect(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            }),
        });
    });

    useEffect(() => {
        registerForPushNotifications().then((token) => setExpoPushToken(token));

        const notificationHAndlerSubscription = Notifications.addNotificationReceivedListener(handleNotification);

        return () => {
            Notifications.removeNotificationSubscription(notificationHAndlerSubscription);
        };
    }, []);

    useEffect(() => {
        if (expoPushToken === "") {
            console.debug("NotificationManager", "Cannot register device as there is no token", expoPushToken);
            // There is no token we can report yet.
            return;
        }
        const topics = ["react-native", `version-${Constants.manifest?.android?.versionCode}`, "cid-EF26"];
        console.debug("NotificationManager", "Registering device with the API", expoPushToken, topics);

        registerDevice({
            DeviceId: expoPushToken,
            Topics: topics,
        });
    }, [expoPushToken, token]);

    return null;
};

const handleNotification = (notification: Notifications.Notification) => {
    console.debug("Received a notification", notification.request.identifier, notification);
};

const registerForPushNotifications = async (): Promise<string> => {
    if (!Device.isDevice) {
        alert("A physical device is required for Push Notifications.");
        return "";
    }

    const status = await Notifications.getPermissionsAsync();

    if (status.status !== "granted") {
        const newStatus = await Notifications.requestPermissionsAsync();

        if (newStatus.status !== "granted") {
            alert("We are not permitted to receive notifications!");
            return "";
        }
    }
    const token = await Notifications.getDevicePushTokenAsync();
    console.debug("expo token", token);

    if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MIN,
            lightColor: "#006459",
        });
    }

    return token.data;
};

export const PlatformNotificationManager = withPlatform(NotificationManager, ["android", "ios"]);
