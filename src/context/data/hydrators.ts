import { parseJsonSafe } from '@/context/data/json'
import { EntityStore, StoreData } from '@/context/data/Cache'
import { RecordMetadata } from '@/context/data/types'

/**
 * Map of store name to deserializer. In most cases, simple JSON parse.
 */
export type Hydrators = {
    [T in keyof StoreData]: (text: string) => Partial<StoreData>[T];
}

/**
 * Special case entity store parsing. Parses all records and derives keys and
 * dict from this list.
 * @param text The text to parse.
 */
function hydrateRecords<T extends RecordMetadata>(text: string): EntityStore<T> | undefined {
    const values = parseJsonSafe(text) as T[] | null | undefined
    if (!values) return undefined
    const keys = values.map(item => item.Id)
    const dict: Record<string, (typeof values)[number]> = {}
    for (const item of values)
        dict[item.Id] = item
    return { keys, values, dict }
}

/**
 * Default item hydrators per store name.
 */
export const hydrators: Hydrators = {
    announcements(text: string): Partial<StoreData>['announcements'] {
        return hydrateRecords(text)
    }, cacheVersion(text: string): Partial<StoreData>['cacheVersion'] {
        return parseJsonSafe(text)
    }, cid(text: string): Partial<StoreData>['cid'] {
        return parseJsonSafe(text)
    }, communications(text: string): Partial<StoreData>['communications'] {
        return hydrateRecords(text)
    }, dealers(text: string): Partial<StoreData>['dealers'] {
        return hydrateRecords(text)
    }, eventDays(text: string): Partial<StoreData>['eventDays'] {
        return hydrateRecords(text)
    }, eventRooms(text: string): Partial<StoreData>['eventRooms'] {
        return hydrateRecords(text)
    }, eventTracks(text: string): Partial<StoreData>['eventTracks'] {
        return hydrateRecords(text)
    }, events(text: string): Partial<StoreData>['events'] {
        return hydrateRecords(text)
    }, images(text: string): Partial<StoreData>['images'] {
        return hydrateRecords(text)
    }, knowledgeEntries(text: string): Partial<StoreData>['knowledgeEntries'] {
        return hydrateRecords(text)
    }, knowledgeGroups(text: string): Partial<StoreData>['knowledgeGroups'] {
        return hydrateRecords(text)
    }, lastSynchronised(text: string): Partial<StoreData>['lastSynchronised'] {
        return parseJsonSafe(text)
    }, maps(text: string): Partial<StoreData>['maps'] {
        return hydrateRecords(text)
    }, notifications(text: string): Partial<StoreData>['notifications'] {
        return parseJsonSafe(text)
    }, settings(text: string): Partial<StoreData>['settings'] {
        return parseJsonSafe(text)
    },
}
