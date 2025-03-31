import { RecordId } from "../eurofurence/types";

export type Notification = {
    recordId: RecordId;
    type: "EventReminder";
    dateScheduledUtc: string;
    dateCreatedUtc: string;
};
