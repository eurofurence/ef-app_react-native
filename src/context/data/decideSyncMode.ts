export type SyncMode = 'full' | 'delta'

/**
 * Decides whether a sync may build on the cached baseline or must refetch it.
 *
 * A delta only carries records changed since the baseline, so it can never
 * surface a record that was merely invisible before. Anything that changes
 * which records are visible - a different convention, cache format, or identity
 * - therefore invalidates the baseline.
 */
export function decideSyncMode(
  requested: { full?: boolean },
  cached: {
    lastSynchronised: string
    cid: string
    cacheVersion: number
    lastSyncAuthKey: string
  },
  current: { cid: string; cacheVersion: number; authKey: string }
): SyncMode {
  if (requested.full) return 'full'
  if (!cached.lastSynchronised) return 'full'
  if (cached.cid !== current.cid) return 'full'
  if (cached.cacheVersion !== current.cacheVersion) return 'full'
  if (cached.lastSyncAuthKey !== current.authKey) return 'full'
  return 'delta'
}

/**
 * Identity a sync is served for. Internal records are role-gated, so roles are
 * part of the identity, not just the subject.
 */
export function authKeyOf(
  idData: { sub?: string } | null,
  user: { Roles?: string[] } | null
): string {
  return `${idData?.sub ?? ''}/${user?.Roles?.join(',') ?? ''}`
}
