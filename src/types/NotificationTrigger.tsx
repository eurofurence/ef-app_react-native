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
 * Asserts remote message is notification.
 * @param trigger The trigger to assert.
 */
export const isTriggerWithNotification = (trigger: NotificationTrigger): trigger is FirebaseNotificationTrigger => {
    return trigger.type === "push" && "remoteMessage" in trigger && "notification" in trigger.remoteMessage;
};

/**
 * Asserts remote message is data.
 * @param trigger The trigger to assert.
 */

export const isTriggerWithData = (trigger: NotificationTrigger): trigger is FirebaseDataTrigger => {
    return trigger.type === "push" && "remoteMessage" in trigger && "data" in trigger.remoteMessage;
};
