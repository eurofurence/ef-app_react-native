import type { EfUser } from '@/data/types/EfUser'

/**
 * Role set was built for this array.
 */
let inRoleSetFor: string[] | null = null

/**
 * Role set.
 */
let inRoleSet: Set<string> | null = null

/**
 * Returns true if the given user is in the provided role.
 * @param user The user to check.
 * @param role The role to check for.
 */
export function inRole(user: EfUser | null, role: string) {
  // No check available.
  if (user === null) return false

  // Rebuild if for different role array.
  if (inRoleSetFor !== user.Roles || inRoleSet === null) {
    inRoleSetFor = user.Roles
    inRoleSet = new Set<string>(user.Roles)
  }

  // Check contained.
  return inRoleSet.has(role)
}
