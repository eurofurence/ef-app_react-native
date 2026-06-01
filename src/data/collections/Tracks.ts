import { BasicIndex, createCollection } from "@tanstack/react-db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { api } from "@/data/clients/api";
import { queryClient } from "@/data/clients/query";
import type { EfTrack } from "@/data/types/EfTrack";
import { defineSearch } from "@/data/searching/useSearch";

export const tracksCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ["tracks"],
    async queryFn({ signal }) {
      const response = await api.get<EfTrack[]>("/EventConferenceTracks", { signal });
      return response.data;
    },
    getKey(item) {
      return item.Id;
    },
    autoIndex: "eager",
    defaultIndexType: BasicIndex,
  }),
);

defineSearch(tracksCollection, {
  keys: ["Name"],
});
