import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { BasicIndex, createCollection } from '@tanstack/react-db'
import { api } from '@/data/clients/api'
import { queryClient } from '@/data/clients/query'
import { defineSearch } from '@/data/searching/useSearch'
import type { EfTrack } from '@/data/types/EfTrack'
import { compare } from '@/util/arrays'

export const tracksCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['tracks'],
    meta: { collection: true },
    async queryFn({ signal }) {
      const response = await api.get<EfTrack[]>('/EventConferenceTracks', {
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

defineSearch(tracksCollection, {
  keys: ['Name'],
})
