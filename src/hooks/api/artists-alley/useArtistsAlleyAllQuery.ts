import { TableRegistrationRecord } from '@/context/data/types.api'
import { keepPreviousData, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useAuthContext } from '@/context/auth/Auth'
import { apiBase } from '@/configuration'
import axios, { GenericAbortSignal } from 'axios'

/**
 * Gets the artist alley records with the given access token and optionally an abort signal.
 * @param accessToken The access token.
 * @param signal An abort signal.
 */
export async function getArtistsAlleyAll(accessToken: string | null, signal?: GenericAbortSignal) {
  if (!accessToken) throw new Error('Unauthorized')
  return await axios
    .get(`${apiBase}/ArtistsAlley/all`, {
      signal: signal,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data as TableRegistrationRecord[])
}

/**
 * Uses a query for `getArtistsAlleyAll` with the app auth state.
 */
export function useArtistsAlleyAllQuery(): UseQueryResult<TableRegistrationRecord[] | null> {
  const { accessToken, claims } = useAuthContext()
  return useQuery({
    queryKey: [claims?.sub, 'artists-alley'],
    queryFn: (context) => getArtistsAlleyAll(accessToken, context.signal),
    placeholderData: (data) => keepPreviousData(data),
  })
}
