import { createLiveQueryCollection, eq } from "@tanstack/react-db";
import { imagesCollection } from "@/data/collections/Images";
import { dealersCollection } from "@/data/collections/Dealers";
import { favoriteDealersCollection } from "@/data/collections/FavoriteDealers";

export const dealersFullCollection = createLiveQueryCollection({
  id: "dealersFullCollection",
  query: (q) =>
    q
      .from({ dealer: dealersCollection })
      .leftJoin({ artist: imagesCollection }, ({ dealer, artist }) => eq(dealer.ArtistImageId, artist.Id))
      .leftJoin({ artistThumbnail: imagesCollection }, ({ dealer, artistThumbnail }) => eq(dealer.ArtistThumbnailImageId, artistThumbnail.Id))
      .leftJoin({ artPreview: imagesCollection }, ({ dealer, artPreview }) => eq(dealer.ArtPreviewImageId, artPreview.Id))
      .leftJoin({ favorite: favoriteDealersCollection }, ({ dealer, favorite }) => eq(dealer.Id, favorite.Id))
      .select((result) => ({
        ...result.dealer,
        Artist: result.artist,
        ArtistThumbnail: result.artistThumbnail,
        ArtPreview: result.artPreview,
        Favorite: result.favorite,
      })),
  getKey(item) {
    return item.Id;
  },
});
