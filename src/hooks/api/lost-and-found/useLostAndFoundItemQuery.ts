import { LostAndFoundRecord } from '@/context/data/types.api'
import { keepPreviousData, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useAuthContext } from '@/context/auth/Auth'
import { apiBase } from '@/configuration'
import axios, { GenericAbortSignal } from 'axios'

/**
 * Gets the lost and found record of `id` with the given access token and optionally an abort signal.
 * @param accessToken The access token.
 * @param id The ID of the item.
 * @param signal An abort signal.
 */
export async function getLostAndFoundItem(accessToken: string | null, id: unknown, signal?: GenericAbortSignal) {
  if (!accessToken) throw new Error('Unauthorized')
  return await axios
    .get(`${apiBase}/LostAndFound/${id}`, {
      signal: signal,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data as LostAndFoundRecord)
}

/**
 * Uses a query for `getLostAndFoundItem` with the app auth state.
 * @param id The ID of the item.
 */
export function useLostAndFoundItemQuery(id: unknown): UseQueryResult<LostAndFoundRecord | null> {
  const { accessToken, claims } = useAuthContext()
  return useQuery({
    queryKey: [claims?.sub, 'lost-and-found', id],
    queryFn: (context) => getLostAndFoundItem(accessToken, id, context.signal),
    placeholderData: (data) => keepPreviousData(data),
  })
}
