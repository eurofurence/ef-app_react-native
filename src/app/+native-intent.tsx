import { appBase } from '@/configuration'

const prefixEvents = `${appBase}/Web/Events/`
const prefixDealers = `${appBase}/Web/Dealers/`

export function redirectSystemPath({ path }: { path: string }) {
  if (path.startsWith(prefixEvents)) return `/events/${path.substring(prefixEvents.length)}`
  if (path.startsWith(prefixDealers)) return `/dealers/${path.substring(prefixDealers.length)}`
  return path
}
