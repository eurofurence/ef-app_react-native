import { createLiveQueryCollection, eq } from "@tanstack/react-db";
import { imagesCollection } from "@/data/collections/Images";
import { artistsAlleyCollection } from "@/data/collections/ArtistsAlley";

export const artistsAlleyFullCollection = createLiveQueryCollection({
  id: "artistsAlleyFullCollection",
  query: (q) =>
    q
      .from({ artistsAlley: artistsAlleyCollection })
      .leftJoin({ image: imagesCollection }, ({ artistsAlley, image }) => eq(artistsAlley.ImageId, image.Id))
      .select((result) => ({
        ...result.artistsAlley,
        Image: result.image,
      })),
  getKey(item) {
    return item.Id;
  },
});
