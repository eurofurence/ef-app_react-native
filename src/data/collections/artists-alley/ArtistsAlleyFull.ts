import { createLiveQueryCollection, eq } from '@tanstack/react-db'
import {artistsAlleyCollection} from '@/data/collections/artists-alley/ArtistsAlley'
import type {CollectionItem} from '@/data/collections/CollectionItem'
import {imagesCollection} from '@/data/collections/content/Images'
import { defineSearch } from '@/data/searching/useSearch'

export const artistsAlleyFullCollection = createLiveQueryCollection({
  id: 'artistsAlleyFullCollection',
  query: (q) =>
    q
      .from({artistsAlley: artistsAlleyCollection})
      .join({image: imagesCollection}, ({artistsAlley, image}) =>
        eq(artistsAlley.ImageId, image.Id)
      )
      .select(({artistsAlley, image}) => ({
        ...artistsAlley,
        Image: image ? image : null,
      })),
  getKey(item) {
    return item.Id
  },
})

export type EfArtistsAlleyFull = CollectionItem<
  typeof artistsAlleyFullCollection
>

defineSearch(artistsAlleyFullCollection, {
  keys: ['DisplayName', 'ShortDescription'],
})
