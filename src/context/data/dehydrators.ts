import { stringifyJsonSafe } from '@/context/data/json'
import { StoreData } from '@/context/data/Cache'

/**
 * Map of store name to serializer. In most cases, simple JSON.
 */
export type Dehydrators = {
    [T in keyof StoreData]: (item: Partial<StoreData>[T]) => string;
}

/**
 * Default item dehydrators per store name.
 */
export const dehydrators: Dehydrators = {
    announcements(item: Partial<StoreData>['announcements']): string {
        return stringifyJsonSafe(item?.values)
    }, cacheVersion(item: Partial<StoreData>['cacheVersion']): string {
        return stringifyJsonSafe(item)
    }, cid(item: Partial<StoreData>['cid']): string {
        return stringifyJsonSafe(item)
    }, communications(item: Partial<StoreData>['communications']): string {
        return stringifyJsonSafe(item?.values)
    }, dealers(item: Partial<StoreData>['dealers']): string {
        return stringifyJsonSafe(item?.values)
    }, eventDays(item: Partial<StoreData>['eventDays']): string {
        return stringifyJsonSafe(item?.values)
    }, eventRooms(item: Partial<StoreData>['eventRooms']): string {
        return stringifyJsonSafe(item?.values)
    }, eventTracks(item: Partial<StoreData>['eventTracks']): string {
        return stringifyJsonSafe(item?.values)
    }, events(item: Partial<StoreData>['events']): string {
        return stringifyJsonSafe(item?.values)
    }, images(item: Partial<StoreData>['images']): string {
        return stringifyJsonSafe(item?.values)
    }, knowledgeEntries(item: Partial<StoreData>['knowledgeEntries']): string {
        return stringifyJsonSafe(item?.values)
    }, knowledgeGroups(item: Partial<StoreData>['knowledgeGroups']): string {
        return stringifyJsonSafe(item?.values)
    }, lastSynchronised(item: Partial<StoreData>['lastSynchronised']): string {
        return stringifyJsonSafe(item)
    }, maps(item: Partial<StoreData>['maps']): string {
        return stringifyJsonSafe(item?.values)
    }, notifications(item: Partial<StoreData>['notifications']): string {
        return stringifyJsonSafe(item)
    }, settings(item: Partial<StoreData>['settings']): string {
        return stringifyJsonSafe(item)
    },
}
