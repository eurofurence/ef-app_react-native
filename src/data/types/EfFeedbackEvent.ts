import type { EfId } from '@/data/types/EfId'

export type EfFeedbackEvent = {
  eventId: EfId
  rating: number
  message?: string
}
