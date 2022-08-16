import { FirebaseRemoteMessage, NotificationTrigger, PushNotificationTrigger } from "expo-notifications";

/**
 * Notification type message trigger coming in as an FCM remote message.
 */
export type FirebaseMessageTrigger = PushNotificationTrigger & { remoteMessage: FirebaseRemoteMessage };
/**
 * FCM remote message with a notification payload.
 */
export type FirebaseNotificationTrigger = FirebaseMessageTrigger & { remoteMessage: { notification: Exclude<FirebaseRemoteMessage["notification"], null> } };

/**
 * FCM remote message with a data payload.
 */
export type FirebaseDataTrigger = FirebaseMessageTrigger & { remoteMessage: { data: Exclude<FirebaseRemoteMessage["data"], null> } };

/**
 * Asserts object is a trigger.
 * @param object The object to assert.
 */
export const isTrigger = (object: any): object is NotificationTrigger => typeof object?.type === "string";

/**
 * Asserts remote message is notification, checks that type is push and
 * that trigger.remoteMessage.notification is a non-null object.
 * @param trigger The trigger to assert.
 */
export const isTriggerWithNotification = (trigger: NotificationTrigger): trigger is FirebaseNotificationTrigger =>
    // Is push trigger.
    trigger.type === "push" &&
    // Is for android.
    "remoteMessage" in trigger &&
    // Has non-null notification.
    typeof trigger.remoteMessage.notification === "object" &&
    trigger.remoteMessage.notification !== null;

/**
 * Asserts remote message is data, checks that type is push and
 * that trigger.remoteMessage.data is a non-null object.
 * @param trigger The trigger to assert.
 */
export const isTriggerWithData = (trigger: NotificationTrigger): trigger is FirebaseDataTrigger =>
    // Is push trigger.
    trigger.type === "push" &&
    // Is for android.
    "remoteMessage" in trigger &&
    // Has non-null data.
    typeof trigger.remoteMessage.data === "object" &&
    trigger.remoteMessage.data !== null;
