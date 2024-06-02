import { useLastNotificationResponse } from "expo-notifications";
import moment from "moment";
import { useEffect } from "react";

import { conId } from "../../configuration";
import { useAppNavigation } from "../nav/useAppNavigation";

/**
 * Manages the foreground part notification response handling.
 * @constructor
 */
export const useNotificationRespondedManager = () => {
    const navigation = useAppNavigation("Areas");
    const response = useLastNotificationResponse();

    // Setup handler for notification response.
    useEffect(() => {
        // Track when the response was observed.
        const dateResponded = moment().toISOString();

        // Always log receiving of the message.
        console.log(`Response observed at ${dateResponded}:`, response);

        // Get the data object. Resolve CID, type, and related ID.
        const data = response?.notification?.request?.content?.data;
        const cid = data?.CID;
        const event = data?.Event;
        const relatedId = data?.RelatedId;

        // Check ID match.
        if (cid !== conId) return;

        // Event is for an announcement.
        if (event === "Announcement") {
            // Log navigation.
            console.log(`Navigating to announcement ${relatedId}`);

            // Go to home screen. TODO: Opening the item not implemented.
            return navigation.navigate("Areas", { screen: "Home" });
        }

        // Event is for a personal message.
        if (event === "Notification") {
            // Log navigation.
            console.log(`Navigating to private message ${relatedId}`);

            // Go to private messages. TODO: Opening the item not implemented.
            return navigation.navigate("PrivateMessageList");
        }
    }, [navigation, response]);

    return null;
};
