import { queryCollectionOptions } from '@tanstack/query-db-collection'
import { BasicIndex, createCollection } from '@tanstack/react-db'
import { api } from '@/data/clients/api'
import { queryClient } from '@/data/clients/query'
import { defineSearch } from '@/data/searching/useSearch'
import type { EfId } from '@/data/types/EfId'
import type {
  EfTableRegistration,
  EfTableRegistrationStatus,
} from '@/data/types/EfTableRegistration'

export const artistsAlleyAdminCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['artists-alley', 'admin'],
    meta: { collection: true },
    async queryFn({ signal }) {
      const response = await api.get<EfTableRegistration[]>(
        '/ArtistsAlley/all',
        {
          signal,
        }
      )
      return response.data
    },
    getKey(item) {
      return item.Id
    },
    autoIndex: 'eager',
    defaultIndexType: BasicIndex,
  })
)

defineSearch(artistsAlleyAdminCollection, {
  keys: ['DisplayName', 'ShortDescription'],
})

export async function artistsAlleyAdminChangeStatus(
  id: EfId,
  status: EfTableRegistrationStatus
) {
  await api.put(`/ArtistsAlley/${id}/:status`, status, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  await queryClient.invalidateQueries({
    queryKey: ['artists-alley'],
  })
}

export async function artistsAlleyAdminDelete(id: EfId) {
  await api.delete(`/ArtistsAlley/${id}`)
  await queryClient.invalidateQueries({
    queryKey: ['artists-alley'],
  })
}
