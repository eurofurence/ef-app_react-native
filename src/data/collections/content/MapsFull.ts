import {  createLiveQueryCollection, eq } from '@tanstack/react-db'
import { mapsCollection } from '@/data/collections/content/Maps'
import type { CollectionItem } from '@/data/collections/CollectionItem'
import { imagesCollection } from '@/data/collections/content/Images'
import { defineSearch } from '@/data/searching/useSearch'

export const mapsFullCollection = createLiveQueryCollection({
  id: 'mapsFullCollection',
  query: (q) =>
    q
      .from({ map: mapsCollection })
      .join({ image: imagesCollection }, ({ map, image }) =>
        eq(map.ImageId, image.Id)
      )
      .select(({ map, image }) => ({
        ...map,
        Image: image ? image : null,
      })),
  getKey(item) {
    return item.Id
  },
})

export type EfMapFull = CollectionItem<
  typeof mapsFullCollection
>

defineSearch(mapsFullCollection, {
  keys: ['Description'],
})
