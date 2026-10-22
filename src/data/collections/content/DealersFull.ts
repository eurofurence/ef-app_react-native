import { createLiveQueryCollection, eq } from '@tanstack/react-db'
import type { CollectionItem } from '@/data/collections/CollectionItem'
import { dealersCollection } from '@/data/collections/content/Dealers'
import { imagesCollection } from '@/data/collections/content/Images'
import { favoriteDealersCollection } from '@/data/collections/supplemental/FavoriteDealers'
import { hiddenDealersCollection } from '@/data/collections/supplemental/HiddenDealers'
import { defineSearch } from '@/data/searching/useSearch'

export const dealersFullCollection = createLiveQueryCollection({
  id: 'dealersFullCollection',
  query: (q) =>
    q
      .from({ dealer: dealersCollection })
      .join({ artist: imagesCollection }, ({ dealer, artist }) =>
        eq(dealer.ArtistImageId, artist.Id)
      )
      .join(
        { artistThumbnail: imagesCollection },
        ({ dealer, artistThumbnail }) =>
          eq(dealer.ArtistThumbnailImageId, artistThumbnail.Id)
      )
      .join({ artPreview: imagesCollection }, ({ dealer, artPreview }) =>
        eq(dealer.ArtPreviewImageId, artPreview.Id)
      )
      .join({ favorite: favoriteDealersCollection }, ({ dealer, favorite }) =>
        eq(dealer.Id, favorite.Id)
      )
      .join({ hidden: hiddenDealersCollection }, ({ dealer, hidden }) =>
        eq(dealer.Id, hidden.Id)
      )
      .select(
        ({
          artPreview,
          artist,
          artistThumbnail,
          dealer,
          favorite,
          hidden,
        }) => ({
          ...dealer,
          Artist: artist ? artist : null,
          ArtistThumbnail: artistThumbnail ? artistThumbnail : null,
          ArtPreview: artPreview ? artPreview : null,
          Favorite: favorite ? favorite : null,
          Hidden: hidden ? hidden : null,
        })
      ),
  getKey(item) {
    return item.Id
  },
})

export type EfDealerFull = CollectionItem<typeof dealersFullCollection>

defineSearch(dealersFullCollection, {
  keys: [
    'Merchandise',
    'ShortDescription',
    'AboutTheArtistText',
    'AboutTheArtText',
    'DisplayNameOrAttendeeNickname',
  ],
})
