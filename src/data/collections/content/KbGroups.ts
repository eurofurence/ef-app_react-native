import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { BasicIndex, createCollection } from '@tanstack/react-db'
import { api } from '@/data/clients/api'
import { queryClient } from '@/data/clients/query'
import { defineSearch } from '@/data/searching/useSearch'
import type { EfKbGroup } from '@/data/types/EfKbGroup'

export const kbGroupsCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['kb-groups'],
    meta: { collection: true },
    async queryFn({ signal }) {
      const response = await api.get<EfKbGroup[]>('/KnowledgeGroups', {
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

defineSearch(kbGroupsCollection, {
  keys: ['Name', 'Description'],
})
