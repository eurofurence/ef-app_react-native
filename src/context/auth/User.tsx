import { createContext, ReactNode, useContext, useMemo } from 'react'

import { avatarBase } from '@/configuration'
import { useAuthContext } from '@/context/auth/Auth'
import { IdData } from '@/context/auth/Auth.idToken'
import { Claims, useUserInfo } from '@/hooks/api/idp/useUserInfo'
import { UserDetails, useUsersSelf } from '@/hooks/api/users/useUsersSelf'

/**
 * Converts ID data to a claims-compatible object.
 * @param idData The ID data to convert.
 */
function idToClaims(idData: IdData | null): Claims | null {
  if (!idData) return null
  const result: Claims = {}

  // Try to transfer sub.
  if (idData.sub) {
    result.sub = idData.sub
  }

  // Try to transfer name.
  if (idData.name) {
    result.name = idData.name
  }

  // Try to transfer avatar. It might not be absolute.
  if (idData.avatar) {
    if (idData.avatar.startsWith('http://') || idData.avatar.startsWith('https://')) result.avatar = idData.avatar
    else result.avatar = `${avatarBase}/${idData.avatar}`
  }

  return result
}

/**
 * User context type.
 */
export type UserContextType = {
  /**
   * Current claims. Claims may have been converted from reduced ID token data.
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
  const { idData, refreshToken } = useAuthContext()

  const { data: claims, refetch: refetchClaims } = useUserInfo()
  const { data: user, refetch: refetchSelf } = useUsersSelf()

  // Get value to provide to the children.
  const value = useMemo<UserContextType>(
    () => ({
      claims: claims ?? idToClaims(idData) ?? null,
      user: user ?? null,
      refresh: async () => {
        await refreshToken()
        await refetchClaims()
        await refetchSelf()
      },
    }),
    [idData, claims, user, refreshToken, refetchClaims, refetchSelf]
  )

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
