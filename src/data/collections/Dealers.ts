import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { BasicIndex, createCollection } from '@tanstack/react-db'
import { api } from '@/data/clients/api'
import { queryClient } from '@/data/clients/query'
import { defineSearch } from '@/data/searching/useSearch'
import type { EfDealer } from '@/data/types/EfDealer'

export const dealersCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['dealers'],
    async queryFn({ signal }) {
      const response = await api.get<EfDealer[]>('/Dealers', { signal })
      return response.data
    },
    getKey(item) {
      return item.Id
    },
    autoIndex: 'eager',
    defaultIndexType: BasicIndex,
  })
)

defineSearch(dealersCollection, {
  keys: [
    'Merchandise',
    'ShortDescription',
    'AboutTheArtistText',
    'AboutTheArtText',
    'DisplayNameOrAttendeeNickname',
  ],
})
