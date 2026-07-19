import type {EfId} from "@/data/types/EfId";
import type { StandardSchemaV1 } from '@standard-schema/spec'
import type {Collection, UtilsRecord, WithVirtualProps} from '@tanstack/react-db'
import Fuse, { type FuseResult, type IFuseOptions } from 'fuse.js'
import {useEffect, useMemo, useRef, useState} from 'react'

/**
 * Indices by collection.
 */
const indices = new WeakMap<WeakKey, Fuse<unknown>>()

/**
 * Search options by collection.
 */
const searchOptions = new WeakMap<WeakKey, IFuseOptions<any>>()

function getOrInitialize<
  T extends object = Record<string, unknown>,
  TKey extends string | number = string | number,
  TUtils extends UtilsRecord = UtilsRecord,
  TSchema extends StandardSchemaV1 = StandardSchemaV1,
  TInsertInput extends object = T,
>(collection: Collection<T, TKey, TUtils, TSchema, TInsertInput>) {
  // Already initialized
  if (indices.has(collection)) indices.get(collection)

  // Make new, use config.
  const fuse = new Fuse<WithVirtualProps<T, TKey>>(
    [],
    searchOptions.get(collection)
  )

  // Add current values.
  collection.forEach((value) => {
    fuse.add(value)
  })

  // Subscribe to changed values.
  collection.subscribeChanges((changes) => {
    for (const change of changes) {
      if (change.type === 'delete') {
        fuse.remove((d) => d.$key === change.key)
      } else if (change.type === 'update') {
        fuse.remove((d) => d.$key === change.key)
        fuse.add(change.value)
      } else {
        fuse.add(change.value)
      }
    }
  })

  // Update weak ref and return.
  indices.set(collection, fuse)
  return fuse
}

/**
 * Defines how the collection is searched when using the `search` function or the `useSearch` hook.
 * @param collection The collection.
 * @param options The search definition.
 */
export function defineSearch<
  T extends object = Record<string, unknown>,
  TKey extends string | number = string | number,
  TUtils extends UtilsRecord = UtilsRecord,
  TSchema extends StandardSchemaV1 = StandardSchemaV1,
  TInsertInput extends object = T,
>(
  collection: Collection<T, TKey, TUtils, TSchema, TInsertInput>,
  options: IFuseOptions<T>
) {
  searchOptions.set(collection, options)
}

/**
 * Searches the collection. `defineSearch` should have been used on the collection along with the definition.
 * @param collection The collection to search.
 * @param term The term to search for.
 */
export function search<
  T extends object = Record<string, unknown>,
  TKey extends string | number = string | number,
  TUtils extends UtilsRecord = UtilsRecord,
  TSchema extends StandardSchemaV1 = StandardSchemaV1,
  TInsertInput extends object = T,
>(
  collection: Collection<T, TKey, TUtils, TSchema, TInsertInput>,
  term: string
) {
  return getOrInitialize(collection).search(term)
}

/**
 * Uses search results of a collection that is searchable.
 * @param collection The collection.
 * @param term The term to search.
 * @param limit Maximum results
 */
export function useSearch<
  T extends object = Record<string, unknown>,
  TKey extends string | number = string | number,
  TUtils extends UtilsRecord = UtilsRecord,
  TSchema extends StandardSchemaV1 = StandardSchemaV1,
  TInsertInput extends object = T,
>(
  collection: Collection<T, TKey, TUtils, TSchema, TInsertInput>,
  term: string | null,
  limit: number | null | undefined = 15
) {
  // Initialize with current results.
  const [results, setResults] = useState<
    FuseResult<WithVirtualProps<T, TKey>>[] | null
  >(() => {
    if (!term) return null
    const fuse = getOrInitialize(collection)
    return fuse.search(term, limit ? {limit} : undefined)
  })

  // Subscribe to change of search term.
  useEffect(() => {
    if (!term)
      setResults(null)
    else
      setResults(getOrInitialize(collection).search(term, limit ? {limit} : undefined))
  }, [term, limit])

  // Reference for transfer of term to the subscription function.
  const termRef = useRef<string | null>(term)
  termRef.current = term

  // Subscribe to change of collection.
  useEffect(() => {
    const subscription = collection.subscribeChanges(() => {
      if (!termRef.current)
        setResults(null)
      else
        setResults(getOrInitialize(collection).search(termRef.current, limit ? {limit} : undefined))
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [limit])

  return results
}

export function useSearchIds<
  T extends { Id: EfId } = { Id: EfId },
  TKey extends string | number = string | number,
  TUtils extends UtilsRecord = UtilsRecord,
  TSchema extends StandardSchemaV1 = StandardSchemaV1,
  TInsertInput extends object = T,
>(
  collection: Collection<T, TKey, TUtils, TSchema, TInsertInput>,
  term: string | null,
  limit: number | null | undefined = 15
) {
  const results = useSearch(collection, term, limit)
  return useMemo(() => results?.map(result => result.item.Id) ?? null, [results])
}
