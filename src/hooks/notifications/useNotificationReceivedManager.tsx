import { captureException } from "@sentry/react-native";
import { addNotificationReceivedListener, Notification, removeNotificationSubscription, scheduleNotificationAsync } from "expo-notifications";
import moment from "moment-timezone";
import { useEffect } from "react";

import { Platform } from "react-native";
import { PushNotificationTrigger } from "expo-notifications/src/Notifications.types";
import { useAppDispatch } from "../../store";
import { logFCMMessage } from "../../store/background/slice";
import { useNotificationInteractionUtils } from "./useNotificationInteractionUtils";

/**
 * Manages the foreground part of notification handling, as well as handling sync requests
 * originating from a background notification.
 * @constructor
 */
export const useNotificationReceivedManager = () => {
    // Use dispatch for logging and interaction utils.
    const dispatch = useAppDispatch();
    const { assertSynchronized, assertAnnouncement, assertPrivateMessage } = useNotificationInteractionUtils();

    // Setup notification received handler.
    useEffect(() => {
        const receive = addNotificationReceivedListener(async ({ request: { content, trigger, identifier } }: Notification) => {
            try {
                if ((trigger as PushNotificationTrigger).type !== "push") return;

                // Track immediately when the message came in.
                const now = moment();

                // Always log receiving of the message.
                console.log(`Received at ${now.format()}:`, trigger);

                const data = (Platform.OS === "ios" ? (trigger as PushNotificationTrigger)?.payload : (trigger as PushNotificationTrigger)?.remoteMessage?.data) ?? {};
                const event = data.Event as string | undefined;
                const relatedId = data.RelatedId as string | undefined;
                // const cid = data.CID;
                const title: string =
                    Platform.OS === "ios"
                        ? ((trigger as PushNotificationTrigger)?.payload as any).aps?.alert?.title
                        : (trigger as PushNotificationTrigger)?.remoteMessage?.notification?.title;
                const body: string =
                    Platform.OS === "ios"
                        ? ((trigger as PushNotificationTrigger)?.payload as any).aps?.alert?.body
                        : (trigger as PushNotificationTrigger)?.remoteMessage?.notification?.body;

                console.log("Parsed as push notification:", { event, title, body, data });

                // // Check ID match.
                // if (cid !== conId) return;

                switch (event) {
                    case "Sync": {
                        // Is sync, do synchronization silently.
                        await assertSynchronized();

                        // Log sync.
                        console.log("Synchronized for remote Sync request");
                        break;
                    }

                    case "Announcement": {
                        // Schedule notification either at the validity time but at least one second in the future.
                        // Scheduling with seconds is used because of an API issue where scheduleNotificationAsync does not accept
                        // channelId without any form of schedule.
                        const announcement = await assertAnnouncement(relatedId);
                        const delay = announcement ? Math.max(1, moment.utc(announcement.ValidFromDateTimeUtc).diff(now, "seconds")) : 1;
                        await scheduleNotificationAsync({
                            content: { title, body, data },
                            trigger: { channelId: "announcements", seconds: delay },
                        });
                        console.log("Announcement scheduled");
                        break;
                    }

                    case "Notification": {
                        // Force refetch the communication queries.
                        await assertPrivateMessage(relatedId);

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
                dispatch(logFCMMessage({ dateReceivedUtc, content, trigger: trigger as PushNotificationTrigger, identifier }));
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
    }, [assertAnnouncement, assertPrivateMessage, assertSynchronized, dispatch]);

    return null;
};
