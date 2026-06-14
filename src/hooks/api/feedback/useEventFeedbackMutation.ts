import { useMutation } from '@tanstack/react-query'
import { api } from '@/data/clients/api'

/**
 * Event feedback data.
 */
export type EventFeedbackData = {
  eventId: string
  rating: number
  message?: string
} /**
 * Returns a mutation to send feedback.
 */
export function useEventFeedbackMutation() {
  return useMutation({
    mutationFn: (data: EventFeedbackData) =>
      api
        .post(`/EventFeedback`, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => res.status === 204),
  })
}
