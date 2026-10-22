import { useLiveQuery } from '@tanstack/react-db'
import { useMemo } from 'react'
import { announcementsCollection } from '@/data/collections/content/Announcements'
import { dealersFullCollection } from '@/data/collections/content/DealersFull'
import { eventsCollection } from '@/data/collections/content/Events'
import { kbEntriesCollection } from '@/data/collections/content/KbEntries'
import type { EfImage } from '@/data/types/EfImage'

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

export function useImageLocation(key: EfImage['Id']) {
  const { data: events } = useLiveQuery(eventsCollection)
  const { data: dealers } = useLiveQuery(dealersFullCollection)
  const { data: announcements } = useLiveQuery(announcementsCollection)
  const { data: kbEntries } = useLiveQuery(kbEntriesCollection)

  return useMemo((): ImageLocation | undefined => {
    for (const event of events) {
      if (event.PosterImageId === key)
        return {
          type: 'Event',
          location: 'eventPoster',
          title: event.Title,
        }
      if (event.BannerImageId === key)
        return {
          type: 'Event',
          location: 'eventBanner',
          title: event.Title,
        }
    }
    for (const dealer of dealers) {
      if (dealer.ArtistImageId === key)
        return {
          type: 'Dealer',
          location: 'artist',
          title: dealer.DisplayNameOrAttendeeNickname,
        }
      if (dealer.ArtistThumbnailImageId === key)
        return {
          type: 'Dealer',
          location: 'artistThumbnail',
          title: dealer.DisplayNameOrAttendeeNickname,
        }
      if (dealer.ArtPreviewImageId === key)
        return {
          type: 'Dealer',
          location: 'artPreview',
          title: dealer.DisplayNameOrAttendeeNickname,
        }
    }
    for (const announcement of announcements) {
      if (announcement.ImageId === key)
        return {
          type: 'Announcement',
          location: 'announcement',
          title: announcement.Title,
        }
    }
    for (const knowledgeEntry of kbEntries) {
      for (const imageId of knowledgeEntry.ImageIds) {
        if (imageId === key)
          return {
            type: 'KnowledgeEntry',
            location: 'knowledgeEntryBanner',
            title: knowledgeEntry.Title,
          }
      }
    }
  }, [key, events, dealers, announcements, kbEntries])
}
