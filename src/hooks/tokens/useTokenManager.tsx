import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";

import { conId } from "../../configuration";
import { useAuthContext } from "../../context/AuthContext";
import { captureNotificationException } from "../../sentryHelpers";
import { usePostDeviceRegistrationMutation } from "../../store/auth/service";

/**
 * List of topics for this device.
 */
const TOPICS = [`${conId}-${Platform.OS}`, `${conId}-expo`, `${conId}`];

/**
 * Makes sure we can request a token. We must be on a device and have permissions. If
 * permissions are not  given and can be asked for, try to get permission.
 */
const prepareToken = async () => {
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
const retrieveToken = async () => {
    // Get the *device* token. We are using native FCM, therefore we need the device token.
    const response = await Notifications.getDevicePushTokenAsync();
    return response.data;
};

/**
 * Manages the foreground part of notification handling, as well as handling sync requests
 * originating from a background notification.
 * @constructor
 */
export const useTokenManager = () => {
    // Use login state to trigger.
    const { loggedIn } = useAuthContext();

    // Use device registration and subscription.
    const [registerDevice] = usePostDeviceRegistrationMutation();

    // Connect device itself via it's token to the backend and the topics. This
    // effect specifies token as a dependency, as a change of the token results
    // in different behavior of the remote method.
    useEffect(() => {
        (async () => {
            // Prepare it. If not available, do not continue.
            const ok = await prepareToken();
            if (!ok) return false;

            // Acquire the proper token.
            const token = await retrieveToken();

            console.log("FCM TOKEN:", token);

            // Register token as device with all topics.
            await registerDevice({
                DeviceId: token,
                DeviceType: Platform.OS,
            });

            // Return actionable true.
            return true;
        })().then(
            (r) => console.log("Registration and subscription, performed:", r),
            (e) => captureNotificationException("Could not register and subscribe", e),
        );
    }, [loggedIn /* Remote methods depend on token implicitly. */]);

    return null;
};
