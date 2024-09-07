import { captureException } from "@sentry/react-native";
import { addNotificationReceivedListener, Notification, removeNotificationSubscription, scheduleNotificationAsync } from "expo-notifications";
import moment from "moment-timezone";
import { useEffect } from "react";

import { Platform } from "react-native";
import { useSynchronizer } from "../../components/sync/SynchronizationProvider";
import { useAppDispatch, useAppStore } from "../../store";
import { logFCMMessage } from "../../store/background/slice";
import { invalidateCommunicationsQuery } from "../../store/eurofurence/service";
import { announcementsSelectors } from "../../store/eurofurence/selectors/records";

/**
 * Manages the foreground part of notification handling, as well as handling sync requests
 * originating from a background notification.
 * @constructor
 */
export const useNotificationReceivedManager = () => {
    // Use dispatch to handle logging of notifications.
    const store = useAppStore();
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
                const event = data.Event as string | undefined;
                const relatedId = data.RelatedId as string | undefined;
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
                        // Try synchronizing. If it fails, log but continue.
                        await synchronize().catch((error) => {
                            captureException(error, {
                                tags: {
                                    type: "notifications",
                                },
                            });
                        });

                        // Schedule notification either at the validity time but at least one second in the future.
                        // Scheduling with seconds is used because of an API issue where scheduleNotificationAsync does not accept
                        // channelId without any form of schedule.
                        const announcement = relatedId ? announcementsSelectors.selectById(store.getState(), relatedId) : null;
                        const delay = announcement ? Math.max(1, moment.utc(announcement?.ValidFromDateTimeUtc).diff(now, "seconds")) : 1;
                        await scheduleNotificationAsync({
                            content: { title, body, data },
                            trigger: { channelId: "announcements", seconds: delay },
                        });
                        console.log("Announcement scheduled");
                        break;
                    }

                    case "Notification": {
                        // Invalidate the communication queries, as those will need to refetch for the list
                        // of all communications, as well as the item itself.
                        dispatch(invalidateCommunicationsQuery());

                        // Schedule in one second. See "Announcement" comment for explanation.
                        const delay = 1;
                        await scheduleNotificationAsync({
                            content: { title, body, data },
                            trigger: { channelId: "private_messages", seconds: delay },
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
    }, [dispatch, store, synchronize]);

    return null;
};
