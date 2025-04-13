import { RecordMetadata } from '@/context/data/types.api'
import { parseJsonSafe, stringifyJsonSafe } from '@/util/json'

/**
 * Entity store, contains a list of keys, list of sorted values, and associative
 * object from ID to value.
 */
export type EntityStore<T> = readonly T[] & { dict: Readonly<Record<string, T>> }
/**
 * Empty store.
 */
export const emptyEntityStore: EntityStore<never> = Object.freeze(
  Object.assign([], {
    dict: Object.freeze({}),
  })
)

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

/**
 * Definition of a mutable field in the cache data.
 */
export interface SchemaField<T> {
  /**
   * The default value to assume for this field.
   */
  defaultValue: T

  /**
   * Writes the data to a serialized form.
   * @param item The item to serialize.
   */
  serialize(item: T): string

  /**
   * Reads data from a serialized form.
   * @param text The serialized form to read.
   */
  deserialize(text: string): T | undefined
}

/**
 * Definition of a synchronized entity list in the cache data.
 */
export interface SchemaEntities<T> extends SchemaField<EntityStore<T>> {
  /**
   * The field in the API sync response to decode this entity list from.
   */
  syncResponseField: string

  /**
   * Default ordering for the entities in the store.
   * @param left The left item to compare.
   * @param right The right item to compare.
   */
  compare(left: T, right: T): number
}

/**
 * Defines a mutable cache field.
 * @param defaultValue The default value if not present.
 */
export function defineField<T>(defaultValue: T): SchemaField<T> {
  return {
    defaultValue: defaultValue,
    serialize(item: T): string {
      return stringifyJsonSafe(item)
    },
    deserialize(text: string): T | undefined {
      return parseJsonSafe(text)
    },
  }
}

/**
 * Replacer for encoding an entity store.
 * @param key The key to replace for. If this is the dict field, it's ignored.
 * @param value The value to replace for.
 */
function entityStoreStringifyReplacer(key: string, value: any) {
  return key !== 'dict' ? value : undefined
}

/**
 * JSON stringify with special case handling for "undefined".
 * @param value The value to serialize.
 */
function stringifyEntityStore(value: any) {
  return value === undefined ? 'undefined' : JSON.stringify(value, entityStoreStringifyReplacer)
}

/**
 * Defines a synchronized entity field.
 * @param syncResponseField The API sync response field to synchronize the local values to.
 * @param orderBy The default order.
 * @param mode The order mode.
 */
export function defineEntity<T extends RecordMetadata>(syncResponseField: string, orderBy: (item: T) => any, mode: 'asc' | 'desc' = 'asc'): SchemaEntities<T> {
  const less = mode === 'asc' ? 1 : -1
  const more = mode === 'asc' ? -1 : 1
  return {
    defaultValue: emptyEntityStore,
    syncResponseField: syncResponseField,
    serialize(item: EntityStore<T>): string {
      return stringifyEntityStore(item)
    },
    deserialize(text: string): EntityStore<T> | undefined {
      const values = parseJsonSafe(text) as T[] | null | undefined
      if (!values) return undefined
      const dict: Record<string, (typeof values)[number]> = {}
      for (const item of values) dict[item.Id] = item
      return Object.assign(values, { dict })
    },
    compare(left: T, right: T): number {
      const leftKey = orderBy(left)
      const rightKey = orderBy(right)
      if (leftKey < rightKey) return less
      else if (leftKey > rightKey) return more
      else return 0
    },
  }
}
