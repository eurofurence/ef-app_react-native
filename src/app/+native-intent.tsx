import { appBase } from '@/configuration'

const wifiOnsiteHost = 'wifi.onsite.eurofurence.org'
const matchArtistAlley = `${appBase}/Web/ArtistAlley`
const matchArtistAlleyReg = `${appBase}/Web/ArtistAlleyReg`
const matchKnowledgeGroups = `${appBase}/Web/KnowledgeGroups`
const prefixDealers = `${appBase}/Web/Dealers/`
const prefixEvents = `${appBase}/Web/Events/`
const prefixKnowledgeEntries = `${appBase}/Web/KnowledgeEntries/`

export function redirectSystemPath({ path }: { path: string }) {
  if (path.startsWith(prefixEvents))
    return `/events/${path.substring(prefixEvents.length)}`
  if (path.startsWith(prefixDealers))
    return `/dealers/${path.substring(prefixDealers.length)}`
  if (path.startsWith(prefixKnowledgeEntries))
    return `/knowledge/${path.substring(prefixKnowledgeEntries.length)}`
  if (path === matchArtistAlley) return `/artists-alley`
  if (path === matchArtistAlleyReg) return `/artists-alley/reg`
  if (path === matchKnowledgeGroups) return `/knowledge`
  // WiFi deeplinks: forward only the query (id/pw/profile); host/path are not trusted.
  if (path.includes(wifiOnsiteHost) || path.startsWith('eventwifi:')) {
    if (path.startsWith('eventwifi:')) {
      const q = path.indexOf('?')
      return q >= 0 ? `/wifi${path.slice(q)}` : '/wifi'
    }
    try {
      const url = new URL(path)
      if (url.hostname === wifiOnsiteHost) {
        return url.search ? `/wifi${url.search}` : '/wifi'
      }
    } catch {
      // Not an absolute URL; ignore and fall through.
    }
  }
  return path
}
