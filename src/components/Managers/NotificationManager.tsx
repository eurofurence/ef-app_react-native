import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { NotificationBehavior } from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { TaskManagerTaskBody } from "expo-task-manager";
import { noop } from "lodash";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";
import { match } from "ts-pattern";
import { useEffectOnce } from "usehooks-ts";

import { conId, conName } from "../../configuration";
import { withPlatform } from "../../hoc/withPlatform";
import { useAppDispatch, useAppSelector } from "../../store";
import { usePostDeviceRegistrationMutation, usePostSubscribeToTopicMutation } from "../../store/authorization.service";
import { logFCMMessage } from "../../store/background.slice";
import { RecordId } from "../../store/eurofurence.types";
import { useSynchronizer } from "../Synchronization/SynchronizationProvider";

type NotificationData = (
    | { event: "Sync" }
    | { event: "Announcement"; title: string; text: string; relatedId: RecordId }
    | { event: "Notification"; title: string; message: string; relatedId: RecordId }
) & { cid: string };

export const NotificationManager = () => {
    const dispatch = useAppDispatch();
    const [registerDevice] = usePostDeviceRegistrationMutation();
    const [subscribeToTopic] = usePostSubscribeToTopicMutation();
    const [expoPushToken, setExpoPushToken] = useState("");
    const token = useAppSelector((state) => state.authorization.token);
    const { synchronize } = useSynchronizer();

    useEffectOnce(() => {
        // This handles notifications when the app is in the foreground
        Notifications.setNotificationHandler({
            handleNotification: async (notification): Promise<NotificationBehavior> => {
                dispatch(
                    logFCMMessage({
                        dateReceived: moment().toISOString(),
                        content: notification.request.content,
                        identifier: notification.request.identifier,
                    })
                );
                const castData = notification.request.content.data as NotificationData;

                // todo: this might actually block any type of notification so beware.
                return match(castData)
                    .with({ event: "Sync" }, (res) => {
                        synchronize();
                        return { shouldShowAlert: false, shouldSetBadge: false, shouldPlaySound: false };
                    })
                    .with({ event: "Announcement" }, (res) => {
                        notification.request.content.title = res.title;
                        notification.request.content.body = res.text;

                        return { shouldShowAlert: true, shouldSetBadge: true, shouldPlaySound: true };
                    })
                    .with({ event: "Notification" }, (res) => {
                        notification.request.content.title = res.title;
                        notification.request.content.body = res.text;

                        return { shouldShowAlert: true, shouldSetBadge: true, shouldPlaySound: true };
                    })
                    .otherwise(() => ({
                        shouldShowAlert: false,
                        shouldSetBadge: false,
                        shouldPlaySound: false,
                    }));
            },
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
        // Register all the notification handlers
        registerForPushNotifications().then((token) => setExpoPushToken(token));

        const notificationHandlerSubscription = Notifications.addNotificationReceivedListener(handleNotification);
        Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

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
            const topics = [`${conId}-android`, `${conId}-expo`, `${conId}`];
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

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND_NOTIFICATION_TASK";

// This seems to be the best kind of implementation.
// https://github.com/expo/fyi/blob/main/presenting-notifications-deprecated.md
TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error, executionInfo }: TaskManagerTaskBody<NotificationData>) => {
    console.debug("received data in the background", data, error, executionInfo);

    return match(data)
        .with({ event: "Announcement" }, (res) => {
            // Handle an announcement call while in the background
            Notifications.scheduleNotificationAsync({
                content: {
                    title: res.title,
                    subtitle: `Breaking news from ${conName}`, // todo not very professional
                    body: res.text,
                },
                trigger: null,
            });
        })
        .with({ event: "Notification" }, (res) => {
            // Handle a notification call in the background
            Notifications.scheduleNotificationAsync({
                content: {
                    title: res.title,
                    subtitle: "You have received a private message",
                    body: res.message,
                },
                trigger: null,
            });
        })
        .otherwise(noop); // Discard all other message types
});
