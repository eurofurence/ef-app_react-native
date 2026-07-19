import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { BasicIndex, createCollection } from '@tanstack/react-db'
import { api } from '@/data/clients/api'
import { queryClient } from '@/data/clients/query'
import { defineSearch } from '@/data/searching/useSearch'
import type { EfRoom } from '@/data/types/EfRoom'
import { compare } from '@/util/arrays'

export const roomsCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['rooms'],
    meta: { collection: true },
    async queryFn({ signal }) {
      const response = await api.get<EfRoom[]>('/EventConferenceRooms', {
        signal,
      })
      return response.data
    },
    compare(a, b) {
      return compare(a.Name, b.Name) || compare(a.Id, b.Id)
    },
    getKey(item) {
      return item.Id
    },
    autoIndex: 'eager',
    defaultIndexType: BasicIndex,
  })
)

defineSearch(roomsCollection, {
  keys: ['Name'],
})
