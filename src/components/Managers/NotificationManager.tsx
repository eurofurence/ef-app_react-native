import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import { useEffectOnce } from "usehooks-ts";

import { conId } from "../../configuration";
import { withPlatform } from "../../hoc/withPlatform";
import { useAppDispatch, useAppSelector } from "../../store";
import { usePostDeviceRegistrationMutation, usePostSubscribeToTopicMutation } from "../../store/authorization.service";
import { logFCMMessage } from "../../store/background.slice";

export const NotificationManager = () => {
    const dispatch = useAppDispatch();
    const [registerDevice] = usePostDeviceRegistrationMutation();
    const [subscribeToTopic] = usePostSubscribeToTopicMutation();
    const [expoPushToken, setExpoPushToken] = useState("");
    const token = useAppSelector((state) => state.authorization.token);

    useEffectOnce(() => {
        Notifications.setNotificationHandler({
            handleNotification: async () => ({
                shouldShowAlert: true,
                shouldPlaySound: false,
                shouldSetBadge: false,
            }),
        });
    });

    const handleNotification = useCallback((notification: Notifications.Notification) => {
        console.debug("Received a notification", notification.request.identifier, notification);

        dispatch(
            logFCMMessage({
                dateReceived: moment().toISOString(),
                content: notification.request.content,
                identifier: notification.request.identifier,
            })
        );
    }, []);

    useEffectOnce(() => {
        registerForPushNotifications().then((token) => setExpoPushToken(token));

        const notificationHandlerSubscription = Notifications.addNotificationReceivedListener(handleNotification);

        return () => {
            Notifications.removeNotificationSubscription(notificationHandlerSubscription);
        };
    });

    useEffect(() => {
        (async () => {
            if (expoPushToken === "") {
                console.debug("NotificationManager", "Cannot register device as there is no token", expoPushToken);
                // There is no token we can report yet.
                return;
            }
            const topics = [`${conId}-android`, `${conId}-expo`, `${conId},`];
            console.debug("NotificationManager", "Registering device with the API", expoPushToken, topics);

            await registerDevice({
                DeviceId: expoPushToken,
                Topics: topics,
            });

            console.debug("NotificationManager", "Subscribing via API", topics);

            for (const topic of topics) {
                await subscribeToTopic({
                    DeviceId: expoPushToken,
                    Topic: topic,
                });
            }

            console.debug("NotificationManager", "Completed subscriptions");
        })().catch(console.error);
    }, [expoPushToken, token]);

    return null;
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
