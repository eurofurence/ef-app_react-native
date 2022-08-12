import { RecordId } from "../../store/eurofurence.types";

/**
 * An app notification requesting sync.
 */
export type AppSync = { cid: string; event: "Sync" };

/**
 * An app notification informing of an announcement.
 */
export type AppAnnouncement = { cid: string; event: "Announcement"; title: string; text: string; relatedId: RecordId };

/**
 * An app notification informing of a personal message.
 */
export type AppNotification = { cid: string; event: "Notification"; title: string; message: string; relatedId: RecordId };

/**
 * General app notification.
 */
export type AppPayload = AppSync | AppAnnouncement | AppNotification;

/**
 * Returns true if the object is an app notification.
 */
export const isPayload = (data: any): data is AppPayload =>
    typeof data?.cid === "string" && (data.event === "Sync" || data.event === "Announcement" || data.event === "Notification");

/**
 * Returns true if the object is a sync request.
 */
export const isSync = (data: AppPayload): data is AppSync => data.event === "Sync";

/**
 * Returns true if the object is an announcement.
 */
export const isAnnouncement = (data: AppPayload): data is AppAnnouncement => data.event === "Announcement";

/**
 * Returns true if the object is a personal message.
 */
export const isNotification = (data: AppPayload): data is AppNotification => data.event === "Notification";
