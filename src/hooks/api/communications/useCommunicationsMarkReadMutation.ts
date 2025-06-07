import { useAuthContext } from '@/context/auth/Auth'
import { useMutation } from '@tanstack/react-query'
import axios, { GenericAbortSignal } from 'axios'
import { apiBase } from '@/configuration'
import { queryClient } from '@/context/query/Query'
import { parseISO } from 'date-fns'

/**
 * Posts communication read to the API with the given access token, message ID, and optionally an abort signal.
 * @param accessToken The access token.
 * @param id The ID of the message.
 * @param signal An abort signal.
 */
export async function postCommunicationsMarkRead(accessToken: string | null, id: unknown, signal?: GenericAbortSignal) {
  if (!accessToken) throw new Error('Unauthorized')
  return await axios
    .post(`${apiBase}/Communication/PrivateMessages/${id}/Read`, true, {
      signal: signal,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then((res) => parseISO(res.data))
}

/**
 * Uses a mutation for `postCommunicationsMarkRead` with the app auth state.
 */
export function useCommunicationsMarkReadMutation() {
  const { accessToken, claims } = useAuthContext()
  return useMutation({
    mutationFn: (id: unknown) => postCommunicationsMarkRead(accessToken, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [claims?.sub, 'communications'] }),
  })
}
