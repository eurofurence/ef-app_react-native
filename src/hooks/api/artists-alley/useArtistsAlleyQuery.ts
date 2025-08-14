import { keepPreviousData, useQuery, UseQueryResult } from '@tanstack/react-query'
import axios, { GenericAbortSignal } from 'axios'

import { apiBase } from '@/configuration'
import { useAuthContext } from '@/context/auth/Auth'
import { ArtistAlleyRecord, TableRegistrationRecord } from '@/context/data/types.api'

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

export async function getArtistsAlley(accessToken: string | null, signal?: GenericAbortSignal) {
  if (!accessToken) throw new Error('Unauthorized')
  return await axios
    .get(`${apiBase}/ArtistsAlley`, {
      signal: signal,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data as ArtistAlleyRecord[])
}

/**
 * Uses a query for `getArtistsAlleyAll` with the app auth state.
 */
export function useArtistsAlleyQuery(usePrivileged: boolean): UseQueryResult<ArtistAlleyRecord[] | null> {
  const { accessToken, idData } = useAuthContext()
  return useQuery({
    queryKey: [idData?.sub, 'artists-alley'],
    queryFn: (context) => (usePrivileged ? getArtistsAlleyAll(accessToken, context.signal) : getArtistsAlley(accessToken, context.signal)),
    placeholderData: (data) => keepPreviousData(data),
  })
}
