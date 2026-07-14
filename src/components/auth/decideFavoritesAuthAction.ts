export type FavoritesAuthAction = 'merge' | 'clear' | 'none'

/**
 * Maps an auth-state transition to the favourites action to take.
 * - merge: became (or started) logged in.
 * - clear: active sign-out (logged out without an expiry).
 * - none: session expiry (handled by the modal) or no relevant change.
 */
export function decideFavoritesAuthAction(
  prev: { isLoggedIn: boolean } | null,
  next: { isLoggedIn: boolean; sessionExpired: boolean }
): FavoritesAuthAction {
  if (next.isLoggedIn && (prev === null || !prev.isLoggedIn)) return 'merge'
  if (prev?.isLoggedIn && !next.isLoggedIn && !next.sessionExpired)
    return 'clear'
  return 'none'
}
