/**
 * Entity store, contains a list of keys, list of sorted values, and associative
 * object from ID to value.
 */
export type EntityStore<T> = Readonly<T[]> & { dict: Readonly<Record<string, T>> }
/**
 * Empty store.
 */
export const emptyEntityStore: EntityStore<never> = Object.freeze(Object.assign([], {
    dict: Object.freeze({}),
}))

/**
 * Maps the data of an entity store.
 * @param store The store to map.
 * @param callbackFn The transformation.
 */
export function mapEntityStore<T, TResult>(store: EntityStore<T>, callbackFn: (input: T) => TResult): EntityStore<TResult> {
    return Object.assign(store.map(callbackFn), {
        dict: Object.fromEntries(Object.entries(store.dict).map(([key, value]) => [key, callbackFn(value)])),
    })
}

/**
 * Filters the data of an entity store.
 * @param store The store to filter.
 * @param predicate The predicate.
 */
export function filterEntityStore<T>(store: EntityStore<T>, predicate: (input: T) => unknown): EntityStore<T> {
    return Object.assign(store.filter(predicate), {
        dict: Object.fromEntries(Object.entries(store.dict).filter(([, value]) => predicate(value))),
    })
}
