import { appBase } from '@/configuration'

const matchWifi = /^(https?:\/\/)?wifi\.onsite\.eurofurence\.org/
const matchArtistAlley = `${appBase}/Web/ArtistAlley`
const matchArtistAlleyReg = `${appBase}/Web/ArtistAlleyReg`
const matchKnowledgeGroups = `${appBase}/Web/KnowledgeGroups`
const prefixDealers = `${appBase}/Web/Dealers/`
const prefixEvents = `${appBase}/Web/Events/`
const prefixKnowledgeEntries = `${appBase}/Web/KnowledgeEntries/`
const prefixWifi = 'eurofurence://wifi'
const uuidLength = 36

export function redirectSystemPath({ path }: { path: string }) {
  if (path.startsWith(prefixEvents)) {
    if (path.endsWith('/Feedback'))
      return `/events/${path.substring(prefixEvents.length, prefixEvents.length + uuidLength)}/feedback`
    return `/events/${path.substring(prefixEvents.length, prefixEvents.length + uuidLength)}`
  }
  if (path.startsWith(prefixDealers))
    return `/dealers/${path.substring(prefixDealers.length, prefixDealers.length + uuidLength)}`
  if (path.startsWith(prefixKnowledgeEntries))
    return `/knowledge/${path.substring(prefixKnowledgeEntries.length, prefixKnowledgeEntries.length + uuidLength)}`
  if (path === matchArtistAlley) return `/artists-alley`
  if (path === matchArtistAlleyReg) return `/artists-alley/reg`
  if (path === matchKnowledgeGroups) return `/knowledge`
  // WiFi deeplinks: forward only the query (id/pw/profile); host/path are not trusted.
  if (path.startsWith(prefixWifi) || matchWifi.test(path)) {
    console.log(path)
    const q = path.indexOf('?')
    return q >= 0 ? `/wifi${path.slice(q)}` : '/wifi'
  }
  return path
}
