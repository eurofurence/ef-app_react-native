import { UserRecord } from '@/context/data/types.api'
import { keepPreviousData, QueryFunctionContext, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useAuthContext } from '@/context/auth/Auth'
import { apiBase } from '@/configuration'
import axios, { GenericAbortSignal } from 'axios'

/**
 * Extends user record with a role map.
 */
export type UserDetails = UserRecord & {
  RoleMap: Record<string, true | undefined>
}

/**
 * Transform the user record and add a role map.
 * @param userRecord The record to transform.
 */
function selectWithRoles(userRecord: UserRecord): UserDetails {
  return {
    ...userRecord,
    RoleMap: Object.fromEntries(userRecord.Roles.map((role) => [role, true])),
  }
}

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
    .then(selectWithRoles)
}

/**
 * Uses a query for `getUserSelf` with the app auth state.
 */
export function useUserSelfQuery(): UseQueryResult<UserDetails | null> {
  const { accessToken, claims } = useAuthContext()
  return useQuery({
    queryKey: [claims?.sub, 'self'],
    queryFn: (context: QueryFunctionContext) => getUserSelf(accessToken, context.signal),
    placeholderData: (data) => keepPreviousData(data),
  })
}
