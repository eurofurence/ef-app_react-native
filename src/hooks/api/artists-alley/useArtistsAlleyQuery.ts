import {
  keepPreviousData,
  type UseQueryResult,
  useQuery,
} from '@tanstack/react-query'
import type { GenericAbortSignal } from 'axios'
import type {
  ArtistAlleyRecord,
  TableRegistrationRecord,
} from '@/context/data/types.api'
import { api } from '@/data/clients/api'

/**
 * Gets the artist alley records with the given access token and optionally an abort signal.
 * @param signal An abort signal.
 */
export async function getArtistsAlleyAll(signal?: GenericAbortSignal) {
  return await api
    .get(`/ArtistsAlley/all`, {
      signal: signal,
    })
    .then((res) => res.data as TableRegistrationRecord[])
}

export async function getArtistsAlley(signal?: GenericAbortSignal) {
  return await api
    .get(`/ArtistsAlley`, {
      signal: signal,
    })
    .then((res) => res.data as ArtistAlleyRecord[])
}

/**
 * Uses a query for `getArtistsAlleyAll` with the app auth state.
 */
export function useArtistsAlleyQuery(
  usePrivileged: boolean
): UseQueryResult<ArtistAlleyRecord[] | null> {
  return useQuery({
    queryKey: ['artists-alley'],
    queryFn: ({ signal }) =>
      usePrivileged ? getArtistsAlleyAll(signal) : getArtistsAlley(signal),
    placeholderData: (data) => keepPreviousData(data),
  })
}
