import { BasicIndex, createCollection, localStorageCollectionOptions } from "@tanstack/react-db";
import { EfLocalNotification } from "@/data/types/EfLocalNotification";

export const localNotificationsCollection = createCollection(
  localStorageCollectionOptions<EfLocalNotification>({
    id: "local-notifications",
    storageKey: "local-notifications",
    getKey: (item) => item.Id,
    autoIndex: "eager",
    defaultIndexType: BasicIndex,
  }),
);

export function useLocalNotificationsIntegration() {
  // todo
}
