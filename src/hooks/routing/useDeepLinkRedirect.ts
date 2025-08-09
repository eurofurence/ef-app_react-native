import { usePathname } from 'expo-router'
import { conId } from '@/configuration'

const prefixEvents = `/${conId}/Web/Events/`
const prefixDealers = `/${conId}/Web/Dealers/`

/**
 * Rewrites current pathnames if they come from web share links. Returns a string if a redirect should be performed.
 */
export function useDeepLinkRedirect() {
  const pathname = usePathname()
  if (pathname.startsWith(prefixEvents)) return `/events/${pathname.substring(prefixEvents.length)}`
  if (pathname.startsWith(prefixDealers)) return `/dealers/${pathname.substring(prefixDealers.length)}`

  return null
}
