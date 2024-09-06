import { captureException } from "@sentry/react-native";
import { addNotificationReceivedListener, Notification, removeNotificationSubscription, scheduleNotificationAsync } from "expo-notifications";
import moment from "moment";
import { useEffect } from "react";

import { Platform } from "react-native";
import { useSynchronizer } from "../../components/sync/SynchronizationProvider";
import { captureNotificationException } from "../../sentryHelpers";
import { useAppDispatch } from "../../store";
import { logFCMMessage } from "../../store/background/slice";

/**
 * Manages the foreground part of notification handling, as well as handling sync requests
 * originating from a background notification.
 * @constructor
 */
export const useNotificationReceivedManager = () => {
    // Use dispatch to handle logging of notifications.
    const dispatch = useAppDispatch();

    // Use synchronizer for performing data refresh.
    const { synchronize } = useSynchronizer();

    // Setup notification received handler.
    useEffect(() => {
        const receive = addNotificationReceivedListener(({ request: { content, trigger, identifier } }: Notification) => {
            if (trigger?.type !== "push") return;

            // Track immediately when the message came in.
            const dateReceived = moment().toISOString();

            // Always log receiving of the message.
            console.log(`Received at ${dateReceived}:`, trigger);

            const data = (Platform.OS === "ios" ? trigger.payload : trigger.remoteMessage?.data) ?? {};
            const event = data.Event;
            // const cid = data.CID;
            const title: string = Platform.OS === "ios" ? (trigger.payload as any).aps?.alert?.title : trigger.remoteMessage?.notification?.title;
            const body: string = Platform.OS === "ios" ? (trigger.payload as any).aps?.alert?.body : trigger.remoteMessage?.notification?.body;

            console.log("Parsed as push notification:", { event, title, body, data });

            // // Check ID match.
            // if (cid !== conId) return;

            switch (event) {
                case "Sync": {
                    // Is sync, do synchronization silently.
                    synchronize().catch(captureException);

                    // Log sync.
                    console.log("Synchronized for remote Sync request");
                    break;
                }

                case "Announcement": {
                    // Schedule it.
                    scheduleNotificationAsync({
                        content: { title, body, data },
                        trigger: null, // { channelId: "announcements" },
                    }).then(
                        () => console.log("Announcement scheduled"),
                        (e) => captureNotificationException("Unable to schedule announcement", e),
                    );
                    break;
                }

                case "Notification": {
                    // Schedule it.
                    scheduleNotificationAsync({
                        content: { title, body, data },
                        trigger: null, // { channelId: "private_messages" },
                    }).then(
                        () => console.log("Personal message scheduled"),
                        (e) => captureNotificationException("Unable to schedule announcement", e),
                    );
                    break;
                }
            }

            // Always dispatch a state update tracking the message.
            dispatch(logFCMMessage({ dateReceived, content, trigger, identifier }));
        });

        // Return removal of subscription.
        return () => {
            removeNotificationSubscription(receive);
        };
    }, [dispatch, synchronize]);

    return null;
};
