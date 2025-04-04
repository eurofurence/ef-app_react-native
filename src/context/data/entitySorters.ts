import { StoreEntities, StoreEntityType } from '@/context/data/Cache'

/**
 * Map of store name to comparer.
 */
export type EntitySorters = {
    [T in keyof StoreEntities]: (a: StoreEntityType<T>, b: StoreEntityType<T>) => number;
}

/**
 * Default item comparers. Applied only on entities.
 */
export const entitySorters: EntitySorters = {
    announcements(a, b): number {
        return -a.ValidFromDateTimeUtc.localeCompare(b.ValidFromDateTimeUtc)
    }, communications(a, b): number {
        return a.CreatedDateTimeUtc.localeCompare(b.CreatedDateTimeUtc)
    }, dealers(a, b): number {
        return a.DisplayNameOrAttendeeNickname.localeCompare(b.DisplayNameOrAttendeeNickname)
    }, eventDays(a, b): number {
        return a.Date.localeCompare(b.Date)
    }, eventRooms(a, b): number {
        return a.Name.localeCompare(b.Name)
    }, eventTracks(a, b): number {
        return a.Name.localeCompare(b.Name)
    }, events(a, b): number {
        return a.StartDateTimeUtc.localeCompare(b.StartDateTimeUtc)
    }, images(a, b): number {
        return a.ContentHashSha1.localeCompare(b.ContentHashSha1)
    }, knowledgeEntries(a, b): number {
        return a.Order - b.Order
    }, knowledgeGroups(a, b): number {
        return a.Order - b.Order
    }, maps(a, b): number {
        return a.Order - b.Order
    },
}
