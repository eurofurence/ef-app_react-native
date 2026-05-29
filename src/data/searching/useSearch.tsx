import { Collection, UtilsRecord, WithVirtualProps } from "@tanstack/react-db";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import Fuse, { FuseResult, IFuseOptions } from "fuse.js";
import { useEffect, useRef, useState } from "react";

const indices = new WeakMap<WeakKey, Fuse<unknown>>();

function getOrInitialize<
  T extends object = Record<string, unknown>,
  TKey extends string | number = string | number,
  TUtils extends UtilsRecord & { searchable: IFuseOptions<T> } = UtilsRecord & { searchable: IFuseOptions<T> },
  TSchema extends StandardSchemaV1 = StandardSchemaV1,
  TInsertInput extends object = T,
>(collection: Collection<T, TKey, TUtils, TSchema, TInsertInput>) {
  // Already initialized
  if (indices.has(collection)) indices.get(collection);

  // Make new, use config.
  const fuse = new Fuse<WithVirtualProps<T, TKey>>([], collection.utils.searchable);

  // Add current values.
  collection.forEach((value) => {
    fuse.add(value);
  });

  // Subscribe to changed values.
  collection.subscribeChanges((changes) => {
    for (const change of changes) {
      if (change.type === "delete") {
        fuse.remove((d) => d.$key === change.key);
      } else if (change.type === "update") {
        fuse.remove((d) => d.$key === change.key);
        fuse.add(change.value);
      } else {
        fuse.add(change.value);
      }
    }
  });

  // Update weak ref and return.
  indices.set(collection, fuse);
  return fuse;
}

/**
 * Uses search results of a collection that is searchable.
 * @param collection The collection.
 * @param term The term to search.
 */
export function useSearch<
  T extends object = Record<string, unknown>,
  TKey extends string | number = string | number,
  TUtils extends UtilsRecord & { searchable: IFuseOptions<T> } = UtilsRecord & { searchable: IFuseOptions<T> },
  TSchema extends StandardSchemaV1 = StandardSchemaV1,
  TInsertInput extends object = T,
>(collection: Collection<T, TKey, TUtils, TSchema, TInsertInput>, term: string | null) {
  // Initialize with current results.
  const [results, setResults] = useState<FuseResult<WithVirtualProps<T, TKey>>[]>(() => {
    if (term === null) return [];
    const fuse = getOrInitialize(collection);
    return fuse.search(term);
  });

  // Subscribe to change of search term.
  useEffect(() => {
    if (term === null) return;
    const fuse = getOrInitialize(collection);
    setResults(fuse.search(term));
  }, [term]);

  // Reference for transfer of term to the subscription function.
  const termRef = useRef<string | null>(term);
  termRef.current = term;

  // Subscribe to change of collection.
  useEffect(() => {
    const subscription = collection.subscribeChanges(() => {
      if (termRef.current === null) return null;
      const fuse = getOrInitialize(collection);
      setResults(fuse.search(termRef.current));
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return results;
}
