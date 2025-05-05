import { UserRecord } from '@/context/data/types.api'
import { QueryFunctionContext, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useAuthContext } from '@/context/auth/Auth'
import { apiBase } from '@/configuration'
import axios, { GenericAbortSignal } from 'axios'
import { useCallback } from 'react'

/**
 * Gets the user self-service data with the given access token and optionally an abort signal.
 * @param accessToken The access token.
 * @param signal An abort signal.
 */
export async function getUserSelf(accessToken: string | null, signal?: GenericAbortSignal) {
  if (!accessToken) throw new Error('Unauthorized')
  return await axios
    .get(`${apiBase}/Users/:self`, {
      signal: signal,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((res) => res.data as UserRecord)
}

/**
 * Uses a query for `getUserSelf` with the app auth state.
 */
export function useUserSelfQuery(): UseQueryResult<UserRecord | null> {
  const { accessToken, claims } = useAuthContext()
  const queryFn = useCallback((context: QueryFunctionContext) => getUserSelf(accessToken, context.signal), [accessToken])
  return useQuery({
    queryKey: [claims?.sub, 'self'],
    queryFn: queryFn,
  })
}
