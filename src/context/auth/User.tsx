import { UserDetails, useUserSelfQuery } from '@/hooks/api/users/useUserSelfQuery'
import { createContext, ReactNode, useContext, useMemo } from 'react'
import { Claims, useAuthContext } from '@/context/auth/Auth'

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
  const { claims, refreshToken, refreshClaims } = useAuthContext()
  // Wrap self query. Add some options.
  const {
    data: user,
    error,
    refetch,
  } = useUserSelfQuery({
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
