import { parseJsonSafe } from '@/context/data/json'
import { StoreData } from '@/context/data/Cache'
import { RecordMetadata } from '@/context/data/types'
import { EntityStore } from '@/context/data/EntityStore'

/**
 * Map of store name to deserializer. In most cases, simple JSON parse.
 */
export type Hydrators = {
    [T in keyof StoreData]: (text: string) => StoreData[T] | undefined;
}

/**
 * Special case entity store parsing. Parses all records and derives keys and
 * dict from this list.
 * @param text The text to parse.
 */
function hydrateRecords<T extends RecordMetadata>(text: string): EntityStore<T> | undefined {
    const values = parseJsonSafe(text) as T[] | null | undefined
    if (!values) return undefined
    const dict: Record<string, (typeof values)[number]> = {}
    for (const item of values)
        dict[item.Id] = item
    return Object.assign(values, { dict })
}

/**
 * Default item hydrators per store name.
 */
export const hydrators: Hydrators = {
    announcements(text: string): StoreData['announcements'] | undefined {
        return hydrateRecords(text)
    }, cacheVersion(text: string): StoreData['cacheVersion'] | undefined {
        return parseJsonSafe(text)
    }, cid(text: string): StoreData['cid'] | undefined {
        return parseJsonSafe(text)
    }, communications(text: string): StoreData['communications'] | undefined {
        return hydrateRecords(text)
    }, dealers(text: string): StoreData['dealers'] | undefined {
        return hydrateRecords(text)
    }, eventDays(text: string): StoreData['eventDays'] | undefined {
        return hydrateRecords(text)
    }, eventRooms(text: string): StoreData['eventRooms'] | undefined {
        return hydrateRecords(text)
    }, eventTracks(text: string): StoreData['eventTracks'] | undefined {
        return hydrateRecords(text)
    }, events(text: string): StoreData['events'] | undefined {
        return hydrateRecords(text)
    }, images(text: string): StoreData['images'] | undefined {
        return hydrateRecords(text)
    }, knowledgeEntries(text: string): StoreData['knowledgeEntries'] | undefined {
        return hydrateRecords(text)
    }, knowledgeGroups(text: string): StoreData['knowledgeGroups'] | undefined {
        return hydrateRecords(text)
    }, lastSynchronised(text: string): StoreData['lastSynchronised'] | undefined {
        return parseJsonSafe(text)
    }, maps(text: string): StoreData['maps'] | undefined {
        return hydrateRecords(text)
    }, notifications(text: string): StoreData['notifications'] | undefined {
        return parseJsonSafe(text)
    }, settings(text: string): StoreData['settings'] | undefined {
        return parseJsonSafe(text)
    },
}
