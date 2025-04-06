# Cache

This folder contains the cache implementation and context provider.

## Source files

`Cache.tsx` Main cache types, reducer definitions, context definition and
providers. Also provides the API side sync.

`dehydrators.ts` Serialization of entries in the cache. Uses immediate or
optimized JSON serialization.

`entitySorters.ts` Default sorting semantics for entities, e.g., by date,
name, or explicit order.

`hydrators.ts` Deserialization of entries in the cache, corresponding to
`dehydrators.ts`.

`internals.ts` Internal data derivation functions, for example, tag names
to displayed icons.

`json.ts` JSON wrappers for handling `undefined` data values.

`README.MD` this file.

`storageBackend.ts` Wrapper around async storage. This is used in combination
with the `.web` variant to provide unified access without platform issues.

`types.ts` API data types, local details extensions and proper data types like
settings or entity wrappers.

`useCacheExtensions.ts` Hook that provides, from the store data, the actually
provided values to be used in the Cache context. This should not be used
outside the cache provider.

## Working with the cache

Select a field that you want to use. All entity data stores are readonly. The
entities are arrays with an extra `dict` property that contains a ID to entity
mapping.

```tsx
const { maps } = useCache()
const filteredMaps = maps.filter(predicate)
const selectedMap = maps.dict[selectionId]
```

Special "value stores" like settings can only be mutated with the appropriate
cache methods (`setValue`, `getValue`, `removeValue`), as they update the
reducer state.
