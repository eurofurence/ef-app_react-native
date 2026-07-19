import { createLiveQueryCollection, eq } from '@tanstack/react-db'
import type { CollectionItem } from '@/data/collections/CollectionItem'
import { announcementsCollection } from '@/data/collections/content/Announcements'
import { imagesCollection } from '@/data/collections/content/Images'
import { defineSearch } from '@/data/searching/useSearch'

export const announcementsFullCollection = createLiveQueryCollection({
  id: 'announcementsFullCollection',
  query: (q) =>
    q
      .from({ announcement: announcementsCollection })
      .join({ image: imagesCollection }, ({ announcement, image }) =>
        eq(announcement.ImageId, image.Id)
      )
      .select(({ announcement, image }) => ({
        ...announcement,
        Image: image ? image : null,
      })),
  getKey(item) {
    return item.Id
  },
})

export type EfAnnouncementFull = CollectionItem<
  typeof announcementsFullCollection
>

defineSearch(announcementsFullCollection, {
  keys: ['Author', 'Title', 'Content'],
})
