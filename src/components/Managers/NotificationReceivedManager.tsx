import { addNotificationReceivedListener, removeNotificationSubscription, scheduleNotificationAsync, Notification } from "expo-notifications";
import moment from "moment";
import { useEffect } from "react";

import { conId } from "../../configuration";
import { withPlatform } from "../../hoc/withPlatform";
import { useAppDispatch } from "../../store";
import { logFCMMessage } from "../../store/background.slice";
import { FirebaseNotificationTrigger, isTrigger, isTriggerWithData, isTriggerWithNotification } from "../../types/NotificationTrigger";
import { useSynchronizer } from "../Synchronization/SynchronizationProvider";

const scheduleNotificationFromTrigger = (source: FirebaseNotificationTrigger) =>
    scheduleNotificationAsync({
        identifier: source.remoteMessage.messageId ?? undefined,
        content: {
            title: source.remoteMessage.notification.title ?? undefined,
            body: source.remoteMessage.notification.body ?? undefined,
            data: source.remoteMessage.data,
        },
        trigger: null,
    });

/**
 * Manages the foreground part of notification handling, as well as handling sync requests
 * originating from a background notification.
 * @constructor
 */
export const NotificationReceivedManager = () => {
    // Use dispatch to handle logging of notifications.
    const dispatch = useAppDispatch();

    // Use synchronizer for performing data refresh.
    const { synchronize } = useSynchronizer();

    // Setup notification received handler.
    useEffect(() => {
        const receive = addNotificationReceivedListener(({ request: { content, trigger, identifier } }: Notification) => {
            // Prevent reentrant error when scheduling a notification locally from a remote message.
            if (!isTrigger(trigger)) {
                console.log("Skipping empty message from remote");
                return;
            }

            // Track immediately when the message came in.
            const dateReceived = moment().toISOString();

            // Always log receiving of the message.
            console.log(`Received at ${dateReceived}:`, trigger);

            // Always dispatch a state update tracking the message.
            dispatch(logFCMMessage({ dateReceived, content, trigger, identifier }));

            // Check if data trigger. Otherwise, not actionable.
            if (isTriggerWithData(trigger)) {
                // Get CID and event type.
                const cid = trigger.remoteMessage.data.CID;
                const event = trigger.remoteMessage.data.Event;

                // Skip if not for this convention.
                if (cid !== conId) return;

                // Handle for sync, announcement, and notification.
                if (event === "Sync") {
                    // Is sync, do synchronization silently.
                    synchronize(false);

                    // Log sync.
                    console.log("Synchronized for remote Sync request");
                } else if (event === "Announcement" && isTriggerWithNotification(trigger)) {
                    // Schedule it.
                    scheduleNotificationFromTrigger(trigger).then(
                        () => console.log("Announcement scheduled"),
                        (e) => console.error("Unable to schedule announcement", e)
                    );
                } else if (event === "Notification" && isTriggerWithNotification(trigger)) {
                    // Schedule it.
                    scheduleNotificationFromTrigger(trigger).then(
                        () => console.log("Personal message scheduled"),
                        (e) => console.error("Unable to schedule personal message", e)
                    );
                }
            }
        });

        // Return removal of subscription.
        return () => {
            removeNotificationSubscription(receive);
        };
    }, []);

    return null;
};

export const PlatformNotificationReceivedManager = withPlatform(NotificationReceivedManager, ["android", "ios"]);
