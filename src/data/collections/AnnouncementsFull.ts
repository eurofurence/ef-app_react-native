import { createLiveQueryCollection, eq } from '@tanstack/react-db'
import { announcementsCollection } from '@/data/collections/Announcements'
import { imagesCollection } from '@/data/collections/Images'
import { defineSearch } from '@/data/searching/useSearch'

export const announcementsFullCollection = createLiveQueryCollection({
  id: 'announcementsFullCollection',
  query: (q) =>
    q
      .from({ announcement: announcementsCollection })
      .leftJoin({ image: imagesCollection }, ({ announcement, image }) =>
        eq(announcement.ImageId, image.Id)
      )
      .select((result) => ({
        ...result.announcement,
        Image: result.image,
      })),
  getKey(item) {
    return item.Id
  },
})

export type EfAnnouncementFull = ReturnType<
  typeof announcementsFullCollection.get
>

defineSearch(announcementsFullCollection, {
  keys: ['Author', 'Title', 'Content'],
})
