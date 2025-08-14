import { keepPreviousData, useQuery, UseQueryResult } from '@tanstack/react-query'
import axios, { GenericAbortSignal } from 'axios'

import { authIssuer } from '@/configuration'
import { useAuthContext } from '@/context/auth/Auth'

/**
 * User claims record.
 */
export type Claims = Record<string, string | string[] | number>

/**
 * Gets the response of hte userinfo endpoint.
 * @param accessToken The access token.
 * @param signal An abort signal.
 */
export async function getUserInfo(accessToken: string | null, signal?: GenericAbortSignal) {
  if (!accessToken) throw new Error('Unauthorized')
  return await axios
    .get(`${authIssuer}/api/v1/userinfo`, {
      signal: signal,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data as Claims)
}

/**
 * Uses a query for `getUserInfo` with the app auth state.
 */
export function useUserInfo(): UseQueryResult<Claims | null> {
  const { accessToken, idData } = useAuthContext()
  return useQuery({
    queryKey: [idData?.sub, 'user-info'],
    queryFn: (context) => getUserInfo(accessToken, context.signal),
    placeholderData: (data) => keepPreviousData(data),
  })
}
