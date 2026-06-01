import { BasicIndex, createCollection, localStorageCollectionOptions } from "@tanstack/react-db";
import type { EfHiddenEvent } from "@/data/types/EfHiddenEvent";

export const hiddenEventsCollection = createCollection(
  localStorageCollectionOptions<EfHiddenEvent>({
    id: "hidden-events",
    storageKey: "hidden-events",
    getKey: (item) => item.Id,
    autoIndex: "eager",
    defaultIndexType: BasicIndex,
  }),
);

export function hiddenEventsToggle(key: EfHiddenEvent["Id"]) {
  return hiddenEventsCollection.has(key) ? hiddenEventsCollection.delete(key) : hiddenEventsCollection.insert({ Id: key });
}
