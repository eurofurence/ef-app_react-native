import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { BasicIndex, createCollection } from '@tanstack/react-db'
import { api } from '@/data/clients/api'
import { queryClient } from '@/data/clients/query'
import { defineSearch } from '@/data/searching/useSearch'
import type { EfLostAndFound } from '@/data/types/EfLostAndFound'

export const lostAndFoundCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['lost-and-found'],
    meta: { collection: true },
    async queryFn({ signal }) {
      const response = await api.get<EfLostAndFound[]>('/LostAndFound/Items', {
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

defineSearch(lostAndFoundCollection, {
  keys: ['Title', 'Description'],
})
