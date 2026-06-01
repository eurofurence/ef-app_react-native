import { createLiveQueryCollection, eq } from "@tanstack/react-db";
import { imagesCollection } from "@/data/collections/Images";
import { announcementsCollection } from "@/data/collections/Announcements";
import { defineSearch } from "@/data/searching/useSearch";

export const announcementsFullCollection = createLiveQueryCollection({
  id: "announcementsFullCollection",
  query: (q) =>
    q
      .from({ announcement: announcementsCollection })
      .leftJoin({ image: imagesCollection }, ({ announcement, image }) => eq(announcement.ImageId, image.Id))
      .select((result) => ({
        ...result.announcement,
        Image: result.image,
      })),
  getKey(item) {
    return item.Id;
  },
});

defineSearch(announcementsFullCollection, {
  keys: ["Author", "Title", "Content"],
});
