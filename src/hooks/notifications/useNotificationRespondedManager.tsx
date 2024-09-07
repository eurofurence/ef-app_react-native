import { useLastNotificationResponse } from "expo-notifications";
import moment from "moment-timezone";
import { useEffect } from "react";
import { useAppNavigation } from "../nav/useAppNavigation";

/**
 * This handles interacting with scheduled notifications from the received manager.
 * @constructor
 */
export const useNotificationRespondedManager = () => {
    const navigation = useAppNavigation("Areas");
    const response = useLastNotificationResponse();

    // Setup handler for notification response.
    useEffect(() => {
        if (!response) return;

        // Track when the response was observed.
        const dateResponded = moment.utc().format();

        // Always log receiving of the message.
        console.log(`Response observed at ${dateResponded}:`, response);

        // Get the data object. Resolve CID, type, and related ID.
        const data = response?.notification?.request?.content?.data;
        // const cid = data?.CID;
        const event = data?.Event;
        const relatedId = data?.RelatedId;

        // // Check ID match.
        // if (cid !== conId) return;

        if (event === "Announcement") {
            // Event is for an announcement.
            console.log(`Navigating to announcement ${relatedId}`);

            // Go to announcement item.
            return navigation.navigate("AnnounceItem", {
                id: relatedId,
            });
        } else if (event === "Notification") {
            // Event is for a personal message.
            console.log(`Navigating to private message ${relatedId}`);

            // Go to private messages.
            return navigation.navigate("PrivateMessageItem", { id: relatedId });
        } else if (event === "Event") {
            // Event is for a reminder.
            console.log(`Navigating to event ${relatedId}`);

            // Go to event.
            return navigation.navigate("Event", {
                id: relatedId,
            });
        }
    }, [navigation, response]);

    return null;
};
