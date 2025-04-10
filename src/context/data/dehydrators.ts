import { stringifyEntityStore, stringifyJsonSafe } from '@/context/data/json'
import { StoreData } from '@/context/data/Cache'

/**
 * Map of store name to serializer. In most cases, simple JSON.
 */
export type Dehydrators = {
  [T in keyof StoreData]: (item: StoreData[T]) => string
}

/**
 * Default item dehydrators per store name.
 */
export const dehydrators: Dehydrators = {
  announcements(item: StoreData['announcements']): string {
    return stringifyEntityStore(item)
  },
  cacheVersion(item: StoreData['cacheVersion']): string {
    return stringifyJsonSafe(item)
  },
  cid(item: StoreData['cid']): string {
    return stringifyJsonSafe(item)
  },
  communications(item: StoreData['communications']): string {
    return stringifyEntityStore(item)
  },
  dealers(item: StoreData['dealers']): string {
    return stringifyEntityStore(item)
  },
  eventDays(item: StoreData['eventDays']): string {
    return stringifyEntityStore(item)
  },
  eventRooms(item: StoreData['eventRooms']): string {
    return stringifyEntityStore(item)
  },
  eventTracks(item: StoreData['eventTracks']): string {
    return stringifyEntityStore(item)
  },
  events(item: StoreData['events']): string {
    return stringifyEntityStore(item)
  },
  images(item: StoreData['images']): string {
    return stringifyEntityStore(item)
  },
  knowledgeEntries(item: StoreData['knowledgeEntries']): string {
    return stringifyEntityStore(item)
  },
  knowledgeGroups(item: StoreData['knowledgeGroups']): string {
    return stringifyEntityStore(item)
  },
  lastSynchronised(item: StoreData['lastSynchronised']): string {
    return stringifyJsonSafe(item)
  },
  maps(item: StoreData['maps']): string {
    return stringifyEntityStore(item)
  },
  notifications(item: StoreData['notifications']): string {
    return stringifyJsonSafe(item)
  },
  settings(item: StoreData['settings']): string {
    return stringifyJsonSafe(item)
  },
}
