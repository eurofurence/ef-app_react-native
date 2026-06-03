import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { BasicIndex, createCollection } from '@tanstack/react-db'
import { api } from '@/data/clients/api'
import { queryClient } from '@/data/clients/query'
import { defineSearch } from '@/data/searching/useSearch'
import type { EfEvent } from '@/data/types/EfEvent'

export const eventsCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['events'],
    async queryFn({ signal }) {
      const response = await api.get<EfEvent[]>('/Events', { signal })
      return response.data
    },
    getKey(item) {
      return item.Id
    },
    autoIndex: 'eager',
    defaultIndexType: BasicIndex,
  })
)

defineSearch(eventsCollection, {
  keys: ['Title', 'SubTitle', 'Abstract', 'Description'],
})
