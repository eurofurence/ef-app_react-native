import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { BasicIndex, createCollection } from '@tanstack/react-db'
import { api } from '@/data/clients/api'
import { queryClient } from '@/data/clients/query'
import { defineSearch } from '@/data/searching/useSearch'
import type { EfArtistsAlley } from '@/data/types/EfArtistsAlley'

export const artistsAlleyCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['artists-alley', 'general'],
    meta: {collection: true},
    async queryFn({ signal }) {
      const response = await api.get<EfArtistsAlley[]>('/ArtistsAlley', {
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

defineSearch(artistsAlleyCollection, {
  keys: ['DisplayName', 'ShortDescription'],
})
