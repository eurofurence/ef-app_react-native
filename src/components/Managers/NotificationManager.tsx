import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { NotificationResponse } from "expo-notifications";
import { Notification } from "expo-notifications/src/Notifications.types";
import moment from "moment";
import { useCallback, useEffect, useMemo } from "react";

import { withPlatform } from "../../hoc/withPlatform";
import { useAppDispatch, useAppSelector } from "../../store";
import { usePostDeviceRegistrationMutation, usePostSubscribeToTopicMutation } from "../../store/authorization.service";
import { logFCMMessage } from "../../store/background.slice";
import { useSynchronizer } from "../Synchronization/SynchronizationProvider";
import { BG_SYNC_REQUEST, scheduleAnnouncement, scheduleNotification, TOPICS } from "./NotificationManager.common";
import { useNotificationChannel, useNotificationInteraction, useNotificationListener } from "./NotificationManager.hooks";
import { isAnnouncement, isNotification, isPayload, isSync } from "./NotificationManager.types";

/**
 * Makes sure we can request a token. We must be on a device and have permissions. If
 * permissions are not  given and can be asked for, try to get permission.
 */
const prepareNotificationToken = async () => {
    // Not a device, useless.
    if (!Device.isDevice) return false;

    // Permission either given or cannot be asked for again, return here with appropriate status.
    const initial = await Notifications.getPermissionsAsync();
    if (initial.granted) return true;
    if (!initial.canAskAgain) return false;

    // Request again. Return if granted now.
    const request = await Notifications.requestPermissionsAsync();
    return request.granted;
};

/**
 * Retrieves the appropriate device token.
 */
const retrieveNotificationToken = async () => {
    // Get the *device* token. We are using native FCM, therefore we need the device token.
    const response = await Notifications.getDevicePushTokenAsync();
    return response.data;
};

/**
 * Manages the foreground part of notification handling, as well as handling sync requests
 * originating from a background notification.
 * @constructor
 */
export const NotificationManager = () => {
    // Use dispatch to handle logging of notifications.
    const dispatch = useAppDispatch();

    // Use token state to trigger effect updates when login state changed.
    const token = useAppSelector((state) => state.authorization.token);

    // Use device registration and subscription.
    const [registerDevice] = usePostDeviceRegistrationMutation();
    const [subscribeToTopic] = usePostSubscribeToTopicMutation();

    // Use synchronizer for performing data refresh.
    const { synchronize } = useSynchronizer();

    // Connect device itself via it's token to the backend and the topics. This
    // effect specifies token as a dependency, as a change of the token results
    // in different behavior of the remote method.
    useEffect(() => {
        (async () => {
            // Prepare it. If not available, do not continue.
            const ok = await prepareNotificationToken();
            if (!ok) return false;

            // Acquire the proper token.
            const token = await retrieveNotificationToken();

            // Register token as device with all topics.
            await registerDevice({
                DeviceId: token,
                Topics: TOPICS,
            });

            // Register token individually for FCM compat.
            for (const topic of TOPICS) {
                await subscribeToTopic({
                    DeviceId: token,
                    Topic: topic,
                });
            }

            // Return actionable true.
            return true;
        })().then(
            (r) => console.log("Registration and subscription, performed:", r),
            (e) => console.error("Could not register and subscribe", e)
        );
    }, [token /* Remote methods depend on token implicitly. */]);

    // Process background sync request when entering foreground.
    useEffect(() => {
        // Handle background sync requests.
        (async () => {
            // Get from async storage, the background task will write this as
            // true when a sync request is sent.
            const data = await AsyncStorage.getItem(BG_SYNC_REQUEST);

            // If was not true, return false, otherwise synchronize, reset, and return true.
            if (data !== "true") {
                return false;
            } else {
                synchronize();
                await AsyncStorage.removeItem(BG_SYNC_REQUEST);
                return true;
            }
        })().then(
            (r) => console.log("Sync request checked, requested:", r),
            (e) => console.error("Sync request could not be checked", e)
        );
    }, []);

    // Set up notification channels to use. Object creation within a memo, as the
    // hook requires a stable object.
    useNotificationChannel(
        useMemo(
            () => ({
                name: "default",
                importance: Notifications.AndroidImportance.MIN,
                lightColor: "#006459",
            }),
            []
        )
    );

    // Set up listener function for foreground.
    useNotificationListener(
        useCallback(async (event: Notification) => {
            dispatch(
                logFCMMessage({
                    dateReceived: moment().toISOString(),
                    content: event.request.content,
                    identifier: event.request.identifier,
                })
            );

            // Get actual data.
            const content = event.request.content.data;

            // If not defined, we cannot process it here, it is most likely
            // meant for direct channel via legacy.
            if (!content) return;

            // Log foreground receive.
            console.log("Received data in foreground", event.request.content.data);

            // Needs to be a notification type payload.
            if (!isPayload(content)) return;

            // Synchronize now.
            if (isSync(content)) {
                return synchronize();
            }

            // Handle all announcements.
            if (isAnnouncement(content)) {
                return scheduleAnnouncement(content).then(
                    () => console.log("Announcement scheduled on foreground"),
                    (e) => console.error("Unable to schedule announcement on foreground", e)
                );
            }

            // Handle all notifications.
            if (isNotification(content)) {
                return scheduleNotification(content).then(
                    () => console.log("Notification scheduled on foreground"),
                    (e) => console.error("Unable to schedule notification on foreground", e)
                );
            }
        }, [])
    );

    // Set up the handler for interacting with the notification.
    useNotificationInteraction(
        useCallback((response: NotificationResponse) => {
            // Log foreground receive.
            console.log("Received response", response.notification.request);

            // Resolve type and ID.
            const [type, id] = response.notification.request.identifier.split(":", 2);

            // Handle announcement.
            if (type === "Announcement") {
                console.log("TODO: Open announcement", id);
                return;
            }

            // Handle notification.
            if (type === "Notification") {
                console.log("TODO: Open PM", id);
            }
        }, [])
    );

    return null;
};

export const PlatformNotificationManager = withPlatform(NotificationManager, ["android", "ios"]);
