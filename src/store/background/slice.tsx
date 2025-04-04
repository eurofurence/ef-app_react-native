import { RecordId } from '@/context/data/types'

export type Notification = {
    recordId: RecordId;
    type: 'EventReminder';
    dateScheduledUtc: string;
    dateCreatedUtc: string;
};
