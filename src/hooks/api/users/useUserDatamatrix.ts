import {
  keepPreviousData,
  type QueryFunctionContext,
  type UseQueryResult,
  useQuery,
} from '@tanstack/react-query'
import axios, { type GenericAbortSignal } from 'axios'

import { apiBase } from '@/configuration'
import { useAuthContext } from '@/context/auth/Auth'

/**
 * Gets the user's data matrix code as an SVG string.
 * @param accessToken The access token.
 * @param signal An abort signal.
 */
async function getUserDatamatrix(
  accessToken: string | null,
  signal?: GenericAbortSignal
) {
  if (!accessToken) throw new Error('Unauthorized')
  return await axios
    .get(`${apiBase}/Users/pass`, {
      signal: signal,
      responseType: 'text',
      transformResponse: (data) => data,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'image/svg+xml',
      },
    })
    .then((res) => res.data)
}

export function useUserDatamatrix(): UseQueryResult<string | null> {
  const { accessToken, idData } = useAuthContext()
  return useQuery({
    queryKey: [idData?.sub, 'datamatrix'],
    queryFn: (context: QueryFunctionContext) =>
      getUserDatamatrix(accessToken, context.signal),
    placeholderData: (data) => keepPreviousData(data),
    retry: false,
  })
}
