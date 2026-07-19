import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { BasicIndex, createCollection } from '@tanstack/react-db'
import { api } from '@/data/clients/api'
import { queryClient } from '@/data/clients/query'
import { defineSearch } from '@/data/searching/useSearch'
import type { EfAnnouncement } from '@/data/types/EfAnnouncement'

export const announcementsCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['announcements'],
    meta: {collection: true},
    async queryFn({ signal }) {
      const response = await api.get<EfAnnouncement[]>('/Announcements', {
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

defineSearch(announcementsCollection, {
  keys: ['Author', 'Title', 'Content'],
})
