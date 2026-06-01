import { BasicIndex, createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { api } from "@/data/clients/api";
import { queryClient } from "@/data/clients/query";
import type { EfAnnouncement } from "@/data/types/EfAnnouncement";
import { defineSearch } from "@/data/searching/useSearch";

export const announcementsCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ["announcements"],
    async queryFn({ signal }) {
      const response = await api.get<EfAnnouncement[]>("/Announcements", { signal });
      return response.data;
    },
    getKey(item) {
      return item.Id;
    },
    autoIndex: "eager",
    defaultIndexType: BasicIndex,
  }),
);

defineSearch(announcementsCollection, {
  keys: ["Author", "Title", "Content"],
});
