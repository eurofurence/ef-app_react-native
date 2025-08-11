import { TableRegistrationRecord } from '@/context/data/types.api'
import { keepPreviousData, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useAuthContext } from '@/context/auth/Auth'
import { apiBase } from '@/configuration'
import axios, { GenericAbortSignal } from 'axios'

/**
 * Gets the caller's table registration record with the given access token and optionally an abort signal.
 * @param accessToken The access token.
 * @param signal An abort signal.
 */
export async function getArtistsAlleyOwnRegistration(accessToken: string | null, signal?: GenericAbortSignal) {
  if (!accessToken) throw new Error('Unauthorized')
  return await axios
    .get(`${apiBase}/ArtistsAlley/TableRegistration/:my-latest`, {
      signal: signal,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      validateStatus: (status) => (status <= 200 && status < 300) || status === 404,
    })
    .then((res) => (res.status === 404 ? null : (res.data as TableRegistrationRecord)))
}

/**
 * Uses a query for `getArtistsAlleyOwnRegistration` with the app auth state.
 */
export function useArtistsAlleyOwnRegistrationQuery(): UseQueryResult<TableRegistrationRecord | null> {
  const { accessToken, idData } = useAuthContext()
  return useQuery({
    queryKey: [idData?.sub, 'artists-alley', 'own-registration'],
    queryFn: (context) => getArtistsAlleyOwnRegistration(accessToken, context.signal),
    placeholderData: (data) => keepPreviousData(data),
  })
}
