import axios, { GenericAbortSignal } from 'axios'
import { apiBase } from '@/configuration'
import { useAuthContext } from '@/context/auth/Auth'
import { useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'

/**
 * Event feedback data.
 */
export type EventFeedbackData = {
  eventId: string
  rating: number
  message?: string
}

/**
 * Posts event feedback to the API with the given access token, feedback data, and optionally an abort signal.
 * @param accessToken The access token.
 * @param data The feedback data.
 * @param signal An abort signal.
 */
export async function postEventFeedback(accessToken: string | null, data: EventFeedbackData, signal?: GenericAbortSignal) {
  if (!accessToken) throw new Error('Unauthorized')
  return await axios
    .post(`${apiBase}/EventFeedback`, data, {
      signal: signal,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then((res) => res.status === 204)
}

/**
 * Uses a mutation for `postEventFeedback` with the app auth state.
 */
export function useEventFeedbackMutation() {
  const { accessToken } = useAuthContext()
  const mutationFn = useCallback((data: EventFeedbackData) => postEventFeedback(accessToken, data), [accessToken])
  return useMutation({
    mutationFn: mutationFn,
  })
}
