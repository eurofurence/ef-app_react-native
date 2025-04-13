import { RecordId } from '@/context/data/types.api'

export type Notification = {
  recordId: RecordId
  type: 'EventReminder'
  dateScheduledUtc: string
  dateCreatedUtc: string
}
