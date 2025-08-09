import { RecordId } from '@/context/data/types.api'

export type Notification = {
  recordId: RecordId
  identifier?: string
  type: 'EventReminder'
  dateScheduledUtc: string
  dateCreatedUtc: string
}
