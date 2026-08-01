import Fuse, { type FuseOptionKey, type IFuseOptions } from 'fuse.js'
import { flatten } from 'lodash'
import { useMemo } from 'react'

import type {
  AnnouncementDetails,
  ArtistAlleyDetails,
  DealerDetails,
  EventDetails,
  KnowledgeEntryDetails,
} from '@/context/data/types.details'
import type { GlobalSearchResult } from '@/context/data/types.own'

/**
 * General search options.
 */
export const searchOptions: IFuseOptions<any> = {
  shouldSort: true,
  threshold: 0.2, // Only slightly more forgiving threshold to prevent sub-par matches
  ignoreLocation: true, // Don't care where in the text the match is
  includeMatches: false, // Don't need match details for performance
  includeScore: false, // Don't need scores for performance
  minMatchCharLength: 3, // Allow short, but not too short matches
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
 * Highest priority on name, followed by categories and keywords.
 * Matches in description and other about texts are less specific.
 */
export const dealersSearchProperties: FuseOptionKey<DealerDetails>[] = [
  { name: 'DisplayNameOrAttendeeNickname', weight: 20 },
  { name: 'Categories', weight: 10 },
  {
    name: 'Keywords',
    getFn: (details) =>
      details.Keywords ? flatten(Object.values(details.Keywords)) : [],
    weight: 5,
  },
  { name: 'ShortDescription', weight: 1 },
  { name: 'AboutTheArtistText', weight: 1 },
  { name: 'AboutTheArtText', weight: 1 },
]

/**
 * Event properties to include in the search.
 * Highest priority on title, followed by subtitle and track.
 * Matches in abstract are less specific and search by room name less likely.
 */
export const eventsSearchProperties: FuseOptionKey<EventDetails>[] = [
  { name: 'Title', weight: 20 },
  { name: 'SubTitle', weight: 10 },
  { name: 'ConferenceTrack.Name', weight: 5 },
  { name: 'PanelHosts', weight: 1 },
  { name: 'Abstract', weight: 0.5 },
  { name: 'ConferenceRoom.Name', weight: 0.5 },
]

/**
 * Knowledge base entry properties to include in the search.
 * Highest priority on title.
 */
export const knowledgeEntriesSearchProperties: FuseOptionKey<KnowledgeEntryDetails>[] =
  [
    { name: 'Title', weight: 5 }, // Increased weight for titles
    { name: 'Text', weight: 1 }, // Full text content
  ]

/**
 * Announcement properties to include in the search.
 * Highest priority on title followed by content.
 */
export const announcementsSearchProperties: FuseOptionKey<AnnouncementDetails>[] =
  [
    { name: 'NormalizedTitle', weight: 5 },
    { name: 'Content', weight: 2 },
    { name: 'Author', weight: 0.5 },
    { name: 'Area', weight: 0.5 },
  ]

/**
 * Artist Alley properties to include in the search.
 * Highest priority on display name, although less critical than with dealers,
 * since name may be less well known.
 */
export const artistAlleySearchProperties: FuseOptionKey<ArtistAlleyDetails>[] =
  [
    { name: 'DisplayName', weight: 3 },
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
export function useFuseMemo<T>(
  data: readonly T[],
  options: IFuseOptions<any>,
  properties: FuseOptionKey<T>[]
) {
  return useMemo(
    () => new Fuse(data, options, Fuse.createIndex(properties, data)),
    [data, options, properties]
  )
}

/**
 * Returns a memoized map of keys to Fuse instances for the given record.
 * @param data The record to index.
 * @param options The search options.
 * @param properties The indexing properties.
 */
export function useFuseRecordMemo<T>(
  data: Readonly<Record<string, readonly T[]>>,
  options: IFuseOptions<any>,
  properties: FuseOptionKey<T>[]
) {
  return useMemo(
    () =>
      Object.fromEntries(
        Object.entries(data).map(([key, value]) => [
          key,
          new Fuse(value, options, Fuse.createIndex(properties, value)),
        ])
      ),
    [data, options, properties]
  )
}
