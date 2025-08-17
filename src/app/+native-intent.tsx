import { appBase } from '@/configuration'

const matchArtistAlley = `${appBase}/Web/ArtistAlley`
const matchArtistAlleyReg = `${appBase}/Web/ArtistAlleyReg`
const matchKnowledgeGroups = `${appBase}/Web/KnowledgeGroups`
const prefixDealers = `${appBase}/Web/Dealers/`
const prefixEvents = `${appBase}/Web/Events/`
const prefixKnowledgeEntries = `${appBase}/Web/KnowledgeEntries/`

export function redirectSystemPath({ path }: { path: string }) {
  if (path.startsWith(prefixEvents)) return `/events/${path.substring(prefixEvents.length)}`
  if (path.startsWith(prefixDealers)) return `/dealers/${path.substring(prefixDealers.length)}`
  if (path.startsWith(prefixKnowledgeEntries)) return `/knowledge/${path.substring(prefixKnowledgeEntries.length)}`
  if (path === matchArtistAlley) return `/artists-alley`
  if (path === matchArtistAlleyReg) return `/artists-alley/reg`
  if (path === matchKnowledgeGroups) return `/knowledge`
  return path
}
