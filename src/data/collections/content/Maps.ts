import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { BasicIndex, createCollection } from '@tanstack/react-db'
import { api } from '@/data/clients/api'
import { queryClient } from '@/data/clients/query'
import { lostAndFoundCollection } from '@/data/collections/content/LostAndFound'
import { defineSearch } from '@/data/searching/useSearch'
import type { EfMap } from '@/data/types/EfMap'

export const mapsCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['maps'],
    meta: { collection: true },
    async queryFn({ signal }) {
      const response = await api.get<EfMap[]>('/Maps', { signal })
      return response.data
    },
    getKey(item) {
      return item.Id
    },
    autoIndex: 'eager',
    defaultIndexType: BasicIndex,
  })
)

defineSearch(lostAndFoundCollection, {
  keys: ['Description'],
})
