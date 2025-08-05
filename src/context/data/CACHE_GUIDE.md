# Cache System Guide

This guide explains how to properly add new cache types and understand the caching system in the Eurofurence app.

## Overview

The cache system consists of several key components:

- **CacheSchema.ts**: Defines what data is cached and how it's stored
- **types.api.ts**: Defines the API data types that come from the server
- **Cache.tsx**: Provides the cache context and synchronization
- **useCacheExtensions.ts**: Provides extended data with cross-references

## Source Files

### [Cache.tsx](Cache.tsx)

Contains the cache context, its type, and the provider. The implementation provides the initialization from locally stored data, mutation operations, and the API synchronization callback. The cache also uses [useCacheExtensions.ts](useCacheExtensions.ts) to provide extended data, i.e., cross-referenced records.

### [CacheSchema.ts](CacheSchema.ts)

Contains the definitions of what is in the cache and how the entries are stored and loaded. This is the location to add new cache data.

### [CacheStore.ts](CacheStore.ts)

The cache store is the store-reducer that handles updating the local data. It provides action types and action creators internally used by the [Cache.tsx](Cache.tsx).

### [CacheTools.ts](CacheTools.ts)

Provides the types and field creators used in [CacheSchema.ts](CacheSchema.ts).

### [types.api.ts](types.api.ts)

Remote types somewhat aligned with the data provided by the API.

### [types.details.ts](types.details.ts)

Extensions to the raw API data. See also [useCacheExtensions.ts](useCacheExtensions.ts). To add new data to an entities details, define the fields here and update the derivation in the cache extensions.

### [types.own.ts](types.own.ts)

Types used locally like settings and image usage locations.

### [useCacheExtensions.derived.ts](useCacheExtensions.derived.ts)

Contains the methods used to derive the detail data. New data derivations used in the cache extensions can be added here.

### [useCacheExtensions.searching.ts](useCacheExtensions.searching.ts)

Contains the search definitions as well as hooks to provide the Fuse indices.

### [useCacheExtensions.ts](useCacheExtensions.ts)

Uses the cache data and connects the records as well as extending them by data that is not provided by the API. To add new details, find the appropriate memo and apply the data changes within the `mapEntityStore` invocation.

## Step-by-Step Guide: Adding a New Cache Type

### 1. Define the API Type

First, add your type to `src/context/data/types.api.ts`:

```typescript
export type MyNewRecord = RecordMetadata & {
  Name: string
  Description?: string
  // ... other fields
}
```

### 2. Add to Cache Schema

Add your entity to `src/context/data/CacheSchema.ts` in the `schemaEntities` object:

```typescript
export const schemaEntities = {
  // ... existing entities
  myNewItems: defineEntity<MyNewRecord>('MyNewItems', (item) => item.Name),
} as const
```

**Parameters for `defineEntity`**:

- `'MyNewItems'`: The field name in the API sync response (must match exactly!)
- `(item) => item.Name`: The field to sort by (can be any field from your record)
- Optional third parameter: `'asc'` or `'desc'` for sort order (defaults to `'asc'`)

### 3. Create API Hook

Create a hook in `src/hooks/api/` to fetch your data:

```typescript
// src/hooks/api/my-new-items/useMyNewItemsQuery.ts
import { MyNewRecord } from '@/context/data/types.api'
import { useQuery } from '@tanstack/react-query'
import { apiBase } from '@/configuration'
import { useAuth } from '@/context/auth/Auth'

export async function getMyNewItems(accessToken: string | null, signal?: GenericAbortSignal) {
  if (!accessToken) return null

  return axios
    .get(`${apiBase}/MyNewItems`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      signal,
    })
    .then((res) => res.data as MyNewRecord[])
}

export function useMyNewItemsQuery(): UseQueryResult<MyNewRecord[] | null> {
  const { accessToken } = useAuth()

  return useQuery({
    queryKey: ['myNewItems'],
    queryFn: (context) => getMyNewItems(accessToken, context.signal),
    enabled: !!accessToken,
  })
}
```

### 4. Add to Cache Extensions (Optional)

If you need extended data with cross-references, add to `src/context/data/useCacheExtensions.ts`:

```typescript
export type CacheExtensions = {
  // ... existing extensions
  myNewItems: EntityStore<MyNewDetails>
}
```

And implement the extension in the `useCacheExtensions` function:

```typescript
export const useCacheExtensions = (data: StoreData): CacheExtensions => {
  return useMemo(
    () => ({
      // ... existing extensions

      myNewItems: mapEntityStore(data.myNewItems, (item) => ({
        ...item,
        // Add any computed fields or cross-references here
      })),
    }),
    [data]
  )
}
```

### 5. Create Detail Type (Optional)

If you need extended data, create a detail type in `src/context/data/types.details.ts`:

```typescript
export type MyNewDetails = MyNewRecord & {
  // Add computed or cross-referenced fields here
  computedField?: string
}
```

### 6. Add Search Support (Optional)

If you want search functionality, add to `src/context/data/useCacheExtensions.searching.ts`:

```typescript
export const myNewItemsSearchProperties: (keyof MyNewDetails)[] = [
  'Name',
  'Description',
  // ... other searchable fields
]

export const useCacheExtensions = (data: StoreData): CacheExtensions => {
  return useMemo(
    () => ({
      // ... existing extensions

      searchMyNewItems: useFuseRecordMemo(data.myNewItems, myNewItemsSearchProperties),
    }),
    [data]
  )
}
```

## Common Issues and Solutions

### Issue: "Cache remains empty even though sync endpoint returns data"

**Cause**: The sync response field name doesn't match what you defined in `defineEntity`.

**Solution**:

1. Check the API response structure
2. Make sure the field name in `defineEntity` matches exactly
3. Verify the data is actually being returned by the API

### Issue: "Type errors when using the cache"

**Cause**: Missing type definitions or incorrect imports.

**Solution**:

1. Make sure your type extends `RecordMetadata`
2. Import the correct type from `@/context/data/types.api`
3. Check that all required fields are present

### Issue: "Data doesn't update when API changes"

**Cause**: Cache synchronization issues.

**Solution**:

1. Check that `LastChangeDateTimeUtc` is being updated by the API
2. Verify the cache version hasn't changed
3. Try clearing the cache and re-syncing

## Best Practices

1. **Always extend `RecordMetadata`** for API types
2. **Use descriptive field names** in `defineEntity`
3. **Test the API response** to ensure field names match
4. **Add search properties** if the data should be searchable
5. **Use TypeScript** to catch type errors early
6. **Clear cache** when making schema changes during development

## Debugging Tips

1. **Check the API response** in browser dev tools
2. **Use the cache debug tools** in the dev menu
3. **Clear the cache** if data seems stale
4. **Check console logs** for sync errors
5. **Verify field names** match exactly between API and schema

## Working with the Cache

Select a field that you want to use. All entity data stores are readonly. The entities are arrays with an extra `dict` property that contains a ID to entity mapping.

```tsx
const { maps } = useCache()
const filteredMaps = maps.filter(predicate)
const selectedMap = maps.dict[selectionId]
```

Special "value stores" like settings can only be mutated with the appropriate cache methods (`setValue`, `getValue`, `removeValue`), as they update the reducer state.

```tsx
const { getValue } = useCache()
const settings = getValue('settings')
```

## Quick Reference

| Component               | Purpose                             | What to add                                         |
| ----------------------- | ----------------------------------- | --------------------------------------------------- |
| `types.api.ts`          | API data types                      | Your `RecordType` extending `RecordMetadata`        |
| `CacheSchema.ts`        | Cache storage definition            | `defineEntity<YourType>('ApiFieldName', sortField)` |
| `useCacheExtensions.ts` | Extended data with cross-references | Your type in `CacheExtensions` and implementation   |
| `types.details.ts`      | Extended data types                 | `YourDetails` type with computed fields             |
| API hooks               | Data fetching                       | Query hook for your endpoint                        |

Remember: The cache system is designed to be type-safe and efficient. Take your time to understand each step, and don't hesitate to check existing examples in the codebase!

