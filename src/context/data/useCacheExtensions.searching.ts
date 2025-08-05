import Fuse, { FuseOptionKey, IFuseOptions } from 'fuse.js'
import { flatten } from 'lodash'
import { useMemo } from 'react'
import { GlobalSearchResult } from '@/context/data/types.own'
import { AnnouncementDetails, DealerDetails, EventDetails, KnowledgeEntryDetails, ArtistAlleyDetails } from '@/context/data/types.details'

/**
 * General search options.
 */
export const searchOptions: IFuseOptions<any> = {
  shouldSort: true,
  threshold: 0.3, // More forgiving threshold for better partial matches
  ignoreLocation: true, // Don't care where in the text the match is
  includeMatches: false, // Don't need match details for performance
  includeScore: false, // Don't need scores for performance
  minMatchCharLength: 2, // Allow shorter matches for better partial search
  findAllMatches: true, // Find all matches within threshold
}

/**
 * Search options for global results.
 */
export const searchOptionsGlobal: IFuseOptions<any> = {
  ...searchOptions,
  threshold: 0.1,
}

/**
 * Dealer properties to include in the search.
 */
export const dealersSearchProperties: FuseOptionKey<DealerDetails>[] = [
  { name: 'DisplayNameOrAttendeeNickname', weight: 2 },
  { name: 'Categories', weight: 1 },
  {
    name: 'Keywords',
    getFn: (details) => (details.Keywords ? flatten(Object.values(details.Keywords)) : []),
    weight: 1,
  },
  { name: 'ShortDescription', weight: 1 },
  { name: 'AboutTheArtistText', weight: 1 },
  { name: 'AboutTheArtText', weight: 1 },
]

/**
 * Event properties to include in the search.
 */
export const eventsSearchProperties: FuseOptionKey<EventDetails>[] = [
  { name: 'Title', weight: 2 },
  { name: 'SubTitle', weight: 1 },
  { name: 'Abstract', weight: 0.5 },
  { name: 'ConferenceRoom.Name', weight: 0.333 },
  { name: 'ConferenceTrack.Name', weight: 0.333 },
  { name: 'Abstract', weight: 0.5 },
  { name: 'PanelHosts', weight: 0.1 },
]

/**
 * Knowledge base entry properties to include in the search.
 */
export const knowledgeEntriesSearchProperties: FuseOptionKey<KnowledgeEntryDetails>[] = [
  { name: 'Title', weight: 2 }, // Increased weight for titles
  { name: 'Text', weight: 1 }, // Full text content
]

/**
 * Announcement properties to include in the search.
 */
export const announcementsSearchProperties: FuseOptionKey<AnnouncementDetails>[] = [
  { name: 'NormalizedTitle', weight: 1.5 },
  { name: 'Content', weight: 1 },
  { name: 'Author', weight: 0.5 },
  { name: 'Area', weight: 0.5 },
]

/**
 * Artist Alley properties to include in the search.
 */
export const artistAlleySearchProperties: FuseOptionKey<ArtistAlleyDetails>[] = [
  { name: 'DisplayName', weight: 2 },
  { name: 'ShortDescription', weight: 1 },
]

/**
 * Properties for global search to include in the search, combined from dealers,
 * events, and knowledge base entries.
 */
export const globalSearchProperties: FuseOptionKey<GlobalSearchResult>[] = [
  ...(dealersSearchProperties as any),
  ...(eventsSearchProperties as any),
  ...(knowledgeEntriesSearchProperties as any),
  ...(artistAlleySearchProperties as any),
]

/**
 * Returns a memoized Fuse instance for the given data.
 * @param data The data to index.
 * @param options The search options.
 * @param properties The indexing properties.
 */
export function useFuseMemo<T>(data: readonly T[], options: IFuseOptions<any>, properties: FuseOptionKey<T>[]) {
  return useMemo(() => new Fuse(data, options, Fuse.createIndex(properties, data)), [data, options, properties])
}

/**
 * Returns a memoized map of keys to Fuse instances for the given record.
 * @param data The record to index.
 * @param options The search options.
 * @param properties The indexing properties.
 */
export function useFuseRecordMemo<T>(data: Readonly<Record<string, readonly T[]>>, options: IFuseOptions<any>, properties: FuseOptionKey<T>[]) {
  return useMemo(
    () => Object.fromEntries(Object.entries(data).map(([key, value]) => [key, new Fuse(value, options, Fuse.createIndex(properties, value))])),
    [data, options, properties]
  )
}
