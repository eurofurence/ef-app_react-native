import { ArtistAlleyOwnTableRegistrationRecord } from '@/context/data/types.api'
import { keepPreviousData, QueryFunctionContext, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useAuthContext } from '@/context/auth/Auth'
import { apiBase } from '@/configuration'
import axios, { GenericAbortSignal } from 'axios'
import { useCallback } from 'react'

/**
 * Gets the caller's table registration record with the given access token and optionally an abort signal.
 * @param accessToken The access token.
 * @param signal An abort signal.
 */
export async function getArtistAlleyOwnRegistration(accessToken: string | null, signal?: GenericAbortSignal) {
  if (!accessToken) throw new Error('Unauthorized')
  return await axios
    .get(`${apiBase}/ArtistsAlley/TableRegistration/:my-latest`, {
      signal: signal,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      validateStatus: (status) => (status <= 200 && status < 300) || status === 404,
    })
    .then((res) => (res.status === 404 ? null : (res.data as ArtistAlleyOwnTableRegistrationRecord)))
}

/**
 * Uses a query for `getArtistAlleyOwnRegistration` with the app auth state.
 */
export function useArtistAlleyOwnRegistrationQuery(): UseQueryResult<ArtistAlleyOwnTableRegistrationRecord | null> {
  const { accessToken, claims } = useAuthContext()
  const queryFn = useCallback((context: QueryFunctionContext) => getArtistAlleyOwnRegistration(accessToken, context.signal), [accessToken])
  return useQuery({
    queryKey: [claims?.sub, 'artist-alley-own-registration'],
    queryFn: queryFn,
    placeholderData: (data) => keepPreviousData(data),
  })
}
