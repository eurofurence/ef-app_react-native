import { TableRegistrationRecord } from '@/context/data/types.api'
import { keepPreviousData, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useAuthContext } from '@/context/auth/Auth'
import { apiBase } from '@/configuration'
import axios, { GenericAbortSignal } from 'axios'

/**
 * Gets the artist alley record of `id` with the given access token and optionally an abort signal.
 * @param accessToken The access token.
 * @param id The ID of the item.
 * @param signal An abort signal.
 */
export async function getArtistsAlleyItem(accessToken: string | null, id: unknown, signal?: GenericAbortSignal) {
  if (!accessToken) throw new Error('Unauthorized')
  return await axios
    .get(`${apiBase}/ArtistsAlley/${id}`, {
      signal: signal,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data as TableRegistrationRecord)
}

/**
 * Uses a query for `getArtistsAlleyItem` with the app auth state.
 * @param id The ID of the item.
 */
export function useArtistsAlleyItemQuery(id: unknown): UseQueryResult<TableRegistrationRecord | null> {
  const { accessToken, claims } = useAuthContext()
  return useQuery({
    queryKey: [claims?.sub, 'artists-alley', id],
    queryFn: (context) => getArtistsAlleyItem(accessToken, id, context.signal),
    placeholderData: (data) => keepPreviousData(data),
  })
}
