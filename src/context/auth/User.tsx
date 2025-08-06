import { createContext, ReactNode, useContext, useMemo } from 'react'
import { Claims, useAuthContext } from '@/context/auth/Auth'
import { UserRecord } from '@/context/data/types.api'
import { keepPreviousData, QueryFunctionContext, useQuery } from '@tanstack/react-query'
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
async function getUserSelf(accessToken: string | null, signal?: GenericAbortSignal) {
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
 * User context type.
 */
export type UserContextType = {
  /**
   * Current claims.
   */
  claims: Claims | null

  /**
   * The current user or null if not authorized.
   */
  user: UserDetails | null

  /**
   * Force refresh. Throws on failure.
   */
  refresh(): Promise<void>
}

/**
 * User context.
 */
export const UserContext = createContext<UserContextType | undefined>(undefined)
UserContext.displayName = 'UserContext'

/**
 * Provides the current user state.
 * @param children The children to provide to.
 * @constructor
 */
export const UserProvider = ({ children }: { children?: ReactNode | undefined }) => {
  const { accessToken, claims, refreshToken, refreshClaims } = useAuthContext()
  // Wrap self query. Add some options.
  const {
    data: user,
    error,
    refetch,
  } = useQuery({
    queryKey: [claims?.sub, 'self'],
    queryFn: (context: QueryFunctionContext) => getUserSelf(accessToken, context.signal),
    placeholderData: (data) => keepPreviousData(data),
    refetchInterval: 60_000,
    retry: false,
  })

  // Get value to provide to the children.
  const value = useMemo<UserContextType>(
    () => ({
      claims: claims,
      user: user ?? null,
      refresh: async () => {
        await refreshToken()
        await refreshClaims()
        await refetch({
          throwOnError: true,
        })
      },
    }),
    [claims, user, refreshToken, refreshClaims, refetch]
  )

  // Don't run if query has not finished yet.
  if (user === undefined && error === null) return null
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

/**
 * Uses the user context.
 */
export const useUserContext = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUserContext must be used within a UserProvider')
  return context
}

/**
 * Shorthand for using the `user` of the `UserContext`.
 */
export const useCurrentUser = () => useUserContext().user
