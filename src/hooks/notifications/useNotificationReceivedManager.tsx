import { captureException } from "@sentry/react-native";
import { addNotificationReceivedListener, Notification, removeNotificationSubscription, scheduleNotificationAsync } from "expo-notifications";
import moment from "moment-timezone";
import { useEffect } from "react";

import { Platform } from "react-native";
import { useSynchronizer } from "../../components/sync/SynchronizationProvider";
import { useAppDispatch } from "../../store";
import { logFCMMessage } from "../../store/background/slice";
import { invalidateCommunicationsQuery } from "../../store/eurofurence/service";

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
        const receive = addNotificationReceivedListener(async ({ request: { content, trigger, identifier } }: Notification) => {
            try {
                if (trigger?.type !== "push") return;

                // Track immediately when the message came in.
                const now = moment();

                // Always log receiving of the message.
                console.log(`Received at ${now.format()}:`, trigger);

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
                        await synchronize();

                        // Log sync.
                        console.log("Synchronized for remote Sync request");
                        break;
                    }

                    case "Announcement": {
                        // Try synchronizing. Schedule notification.
                        await synchronize().catch();
                        await scheduleNotificationAsync({
                            content: { title, body, data },
                            trigger: { channelId: "announcements", seconds: 1 },
                        });
                        console.log("Announcement scheduled");
                        break;
                    }

                    case "Notification": {
                        // Schedule announcement
                        dispatch(invalidateCommunicationsQuery());
                        await scheduleNotificationAsync({
                            content: { title, body, data },
                            trigger: { channelId: "private_messages", seconds: 1 },
                        });
                        console.log("Personal message scheduled");
                        break;
                    }
                }

                // Always dispatch a state update tracking the message. Format message
                // as UTC, so that it can be sorted lexicographically.
                const dateReceivedUtc = now.clone().utc().format();
                dispatch(logFCMMessage({ dateReceivedUtc, content, trigger, identifier }));
            } catch (error) {
                // Capture scheduling errors, tag as notification.
                captureException(error, {
                    tags: {
                        type: "notifications",
                    },
                });
            }
        });

        // Return removal of subscription.
        return () => {
            removeNotificationSubscription(receive);
        };
    }, [dispatch, synchronize]);

    return null;
};
