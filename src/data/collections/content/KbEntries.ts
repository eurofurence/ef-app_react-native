import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { BasicIndex, createCollection } from '@tanstack/react-db'
import { api } from '@/data/clients/api'
import { queryClient } from '@/data/clients/query'
import { defineSearch } from '@/data/searching/useSearch'
import type { EfKbEntry } from '@/data/types/EfKbEntry'

export const kbEntriesCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['kb-entries'],
    meta: {collection: true},
    async queryFn({ signal }) {
      const response = await api.get<EfKbEntry[]>('/KnowledgeEntries', {
        signal,
      })
      return response.data
    },
    getKey(item) {
      return item.Id
    },
    autoIndex: 'eager',
    defaultIndexType: BasicIndex,
  })
)

defineSearch(kbEntriesCollection, {
  keys: ['Title', 'Text'],
})
