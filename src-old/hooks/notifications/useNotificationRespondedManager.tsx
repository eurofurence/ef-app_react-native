import { useLastNotificationResponse } from "expo-notifications";
import moment from "moment-timezone";
import { useEffect } from "react";
import { Platform } from "react-native";
import { captureException } from "@sentry/react-native";
import { useAppNavigation } from "../nav/useAppNavigation";
import { useNotificationInteractionUtils } from "./useNotificationInteractionUtils";

/**
 * This handles interacting with scheduled notifications from the received manager.
 * @constructor
 */
export const useNotificationRespondedManager = () => {
    // Use  interaction utils.
    const { assertAnnouncement, assertEvent, assertPrivateMessage } = useNotificationInteractionUtils();

    // Use navigation for pushing state.
    const navigation = useAppNavigation("Areas");

    // Use response that has to be handled.
    const response = useLastNotificationResponse();

    // Setup handler for notification response.
    useEffect(() => {
        if (!response) return;

        // Track when the response was observed.
        const dateResponded = moment.utc().format();

        // Always log receiving of the message.
        console.log(`Response observed at ${dateResponded}:`, response);

        // TODO: Verify.
        // Get the data object. Resolve CID, type, and related ID.
        const data =
            Platform.OS === "ios"
                ? // Response data on iOS is located in trigger payload.
                  (response as any)?.notification?.request?.trigger?.payload
                : // Response data on Android in content data.
                  (response as any)?.notification?.request?.content?.data;

        console.log(`Response data:`, data);

        // const cid = data?.CID;
        const event = data?.Event;
        const relatedId = data?.RelatedId;

        // // Check ID match.
        // if (cid !== conId) return;

        (async () => {
            if (event === "Announcement") {
                // Assert presence. Log and navigate.
                const item = await assertAnnouncement(relatedId);
                console.log(`Navigating to announcement ${item}`);
                return navigation.navigate("AnnounceItem", {
                    id: relatedId,
                });
            } else if (event === "Notification") {
                // Assert presence. Log and navigate.
                const item = await assertPrivateMessage(relatedId);
                console.log(`Navigating to private message ${item}`);
                return navigation.navigate("PrivateMessageItem", { id: relatedId });
            } else if (event === "Event") {
                // Assert presence. Log and navigate.
                const item = await assertEvent(relatedId);
                console.log(`Navigating to event ${item}`);
                return navigation.navigate("Event", {
                    id: relatedId,
                });
            }
        })().catch(captureException);
    }, [assertAnnouncement, assertEvent, assertPrivateMessage, navigation, response]);

    return null;
};
