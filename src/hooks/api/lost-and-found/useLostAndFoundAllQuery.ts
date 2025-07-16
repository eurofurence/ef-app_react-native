import { LostAndFoundRecord } from '@/context/data/types.api'
import { keepPreviousData, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useAuthContext } from '@/context/auth/Auth'
import { apiBase } from '@/configuration'
import axios, { GenericAbortSignal } from 'axios'

/**
 * Gets the lost and found records with the given access token and optionally an abort signal.
 * @param accessToken The access token.
 * @param signal An abort signal.
 */
export async function getLostAndFoundAll(accessToken: string | null, signal?: GenericAbortSignal) {
  if (!accessToken) throw new Error('Unauthorized')
  return await axios
    .get(`${apiBase}/LostAndFound/Items`, {
      signal: signal,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data as LostAndFoundRecord[])
}

/**
 * Uses a query for `getLostAndFoundAll` with the app auth state.
 */
export function useLostAndFoundAllQuery(): UseQueryResult<LostAndFoundRecord[] | null> {
  const { accessToken, claims } = useAuthContext()
  return useQuery({
    queryKey: [claims?.sub, 'lost-and-found'],
    queryFn: (context) => getLostAndFoundAll(accessToken, context.signal),
    placeholderData: (data) => keepPreviousData(data),
  })
}
