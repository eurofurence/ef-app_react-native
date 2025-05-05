import { useAuthContext } from '@/context/auth/Auth'
import { useMutation } from '@tanstack/react-query'
import axios, { GenericAbortSignal } from 'axios'
import { apiBase } from '@/configuration'
import { queryClient } from '@/context/query/Query'
import { useCallback } from 'react'

/**
 * Communication-send data.
 */
export type CommunicationsSendData = {
  type?: 'byRegistrationId' | 'byIdentityId'
  recipientUid: string
  authorName: string
  toastTitle: string
  toastMessage: string
  subject: string
  message: string
}

/**
 * Sends a PM via the API with the given access token, message data, and optionally an abort signal.
 * @param accessToken The access token.
 * @param data The message data.
 * @param signal An abort signal.
 */
export async function postCommunicationsSend(accessToken: string | null, data: CommunicationsSendData, signal?: GenericAbortSignal) {
  if (!accessToken) throw new Error('Unauthorized')
  const { type, ...message } = data
  return await axios
    .post(`${apiBase}/Communication/PrivateMessages/:${type ?? 'byRegistrationId'}`, message, {
      signal: signal,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data)
}

/**
 * Uses a mutation for `postCommunicationsSend` with the app auth state.
 */
export function useCommunicationsSendMutation() {
  const { accessToken, claims } = useAuthContext()
  const mutationFn = useCallback((data: CommunicationsSendData) => postCommunicationsSend(accessToken, data), [accessToken])
  return useMutation({
    mutationFn: mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [claims?.sub, 'communications'] }),
  })
}
