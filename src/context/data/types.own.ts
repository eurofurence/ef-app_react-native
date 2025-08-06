import { ThemeName } from '@/context/Theme'
import { DealerDetails, EventDetails, KnowledgeEntryDetails } from '@/context/data/types.details'

/**
 * Settings stored in the cache.
 */
export type Settings = {
  theme?: ThemeName
  analyticsEnabled?: boolean
  language?: string
  hiddenEvents?: string[]
  lastViewTimes?: Record<string, string>
  devMenu?: boolean
  timeTravelOffset?: number
  timeTravelEnabled?: boolean
  warnings?: Record<string, boolean>
  favoriteDealers?: string[]
  artistsAlleyLocal?: ArtistsAlleyLocal
}

/**
 * Locally stored data for repeat registrations.
 */
export type ArtistsAlleyLocal = {
  displayName: string
  websiteUrl: string
  shortDescription: string
  telegramHandle: string
}

/**
 * Tagged union for dealers, event,s and knowledge base entries.
 */
export type GlobalSearchResult = (DealerDetails & { type: 'dealer' }) | (EventDetails & { type: 'event' }) | (KnowledgeEntryDetails & { type: 'knowledgeEntry' })
/**
 * Image usage location.
 */
export type ImageLocation =
  | {
      type: 'Event'
      location: 'eventPoster' | 'eventBanner'
      title: string
    }
  | {
      type: 'Dealer'
      location: 'artist' | 'artistThumbnail' | 'artPreview'
      title: string
    }
  | {
      type: 'Announcement'
      location: 'announcement'
      title: string
    }
  | {
      type: 'KnowledgeEntry'
      location: 'knowledgeEntryBanner'
      title: string
    }
