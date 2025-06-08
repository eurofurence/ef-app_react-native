# Cache

This folder contains the cache implementation and context provider.

## Source files

### [Cache.tsx](Cache.tsx)

Contains the cache context, it's type, and the provider. The implementation
provides the initialization from locally stored data, mutation operations,
and the API synchronization callback. The cache also uses [useCacheExtensions.ts](useCacheExtensions.ts)
to provide extended data, i.e., cross-referenced records.

### [CacheSchema.ts](CacheSchema.ts)

Contains the definitions of what is in the cache and how the entries are stored
and loaded. This is the location to add new cache data.

### [CacheStore.ts](CacheStore.ts)

The cache store is the store-reducer that handles updating
the local data. It provides action types and action creators internally used
by the [Cache.tsx](Cache.tsx).

### [CacheTools.ts](CacheTools.ts)

Provides the types and field creators used in [CacheSchema.ts](CacheSchema.ts).

### [README.MD](README.MD)

You are here now.

### [types.api.ts](types.api.ts)

Remote types somewhat aligned with the data provided by the API.

### [types.details.ts](types.details.ts)

Extensions to the raw API data. See also [useCacheExtensions.ts](useCacheExtensions.ts).
To add new data to an entities details, define the fields here and update
the derivation in the cache extensions.

### [types.own.ts](types.own.ts)

Types used locally like settings and image usage locations.

### [useCacheExtensions.derived.ts](useCacheExtensions.derived.ts)

Contains the methods used to derive the detail data. New data
derivations used in the cache extensions can be added here.

### [useCacheExtensions.searching.ts](useCacheExtensions.searching.ts)

Contains the search definitions as well as hooks to provide the Fuse indices.

### [useCacheExtensions.ts](useCacheExtensions.ts)

Uses the cache data and connects the records as well as extending them by
data that is not provided by the API. To add new detials, find the appropriate
memo and apply the data changes within the `mapEntityStore` invocation.

## Adding data

To add a mutable value, modify `schemaValues` in the [CacheSchema.ts](CacheSchema.ts).
To do that, define a field with the `defineField` method and provide the value type
as well as a default value.

To add a new synchronized entity, modify the `schemaEntities`. The field needs the
location, i.e., the name of the JSON field in the sync response to apply changes
from, as well as a default ordering.

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

```tsx
const { getValue } = useCache()
const settings = getValue('settings')
```
