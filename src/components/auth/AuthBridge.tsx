import { captureException } from '@sentry/react-native'
import { useEffect, useRef } from 'react'

import { decideFavoritesAuthAction } from '@/components/auth/decideFavoritesAuthAction'
import { useAuthState } from '@/data/clients/auth'
import { useFavoritesSync } from '@/hooks/data/useFavoritesSync'

/**
 * Drives favourite merge/clear off auth transitions. Renders nothing.
 */
export function AuthBridge() {
  const { isReady, isLoggedIn, sessionExpired } = useAuthState()
  const { mergeFavorites, clearLocalFavorites } = useFavoritesSync()
  const prevRef = useRef<{ isLoggedIn: boolean } | null>(null)

  useEffect(() => {
    if (!isReady) return
    const action = decideFavoritesAuthAction(prevRef.current, {
      isLoggedIn,
      sessionExpired,
    })
    prevRef.current = { isLoggedIn }
    if (action === 'merge') mergeFavorites().catch(captureException)
    else if (action === 'clear') clearLocalFavorites().catch(captureException)
  }, [isReady, isLoggedIn, sessionExpired, mergeFavorites, clearLocalFavorites])

  return null
}
