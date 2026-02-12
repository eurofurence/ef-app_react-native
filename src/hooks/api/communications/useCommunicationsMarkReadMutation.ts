import { useMutation } from '@tanstack/react-query'
import axios, { type GenericAbortSignal } from 'axios'

import { apiBase } from '@/configuration'
import { useAuthContext } from '@/context/auth/Auth'
import { queryClient } from '@/context/query/Query'
import { parseDefaultISO } from '@/util/parseDefaultISO'

/**
 * Posts communication read to the API with the given access token, message ID, and optionally an abort signal.
 * @param accessToken The access token.
 * @param id The ID of the message.
 * @param signal An abort signal.
 */
export async function postCommunicationsMarkRead(
  accessToken: string | null,
  id: unknown,
  signal?: GenericAbortSignal
) {
  if (!accessToken) throw new Error('Unauthorized')
  return await axios
    .post(`${apiBase}/Communication/PrivateMessages/${id}/Read`, true, {
      signal: signal,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    })
    .then((res) => parseDefaultISO(res.data))
}

/**
 * Uses a mutation for `postCommunicationsMarkRead` with the app auth state.
 */
export function useCommunicationsMarkReadMutation() {
  const { accessToken, idData } = useAuthContext()
  return useMutation({
    mutationFn: (id: unknown) => postCommunicationsMarkRead(accessToken, id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: [idData?.sub, 'communications'],
      }),
  })
}
