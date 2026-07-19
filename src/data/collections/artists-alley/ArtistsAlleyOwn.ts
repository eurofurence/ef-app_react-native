import {api} from '@/data/clients/api'
import {queryClient} from '@/data/clients/query'
import {registerTable} from "@/data/collections/artists-alley/registerTable";
import {defineSearch} from '@/data/searching/useSearch'
import type {EfRegisterTable} from "@/data/types/EfRegisterTable";
import type {EfTableRegistration} from "@/data/types/EfTableRegistration";
import {queryCollectionOptions} from '@tanstack/query-db-collection'
import {BasicIndex, createCollection} from '@tanstack/react-db'

export const artistsAlleyOwnCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['artists-alley', 'own'],
    meta: {collection: true},
    async queryFn({signal}) {
      const response = await api.get<EfTableRegistration>('/ArtistsAlley/TableRegistration/:my-latest', {
        signal,
        validateStatus(status) {
          return (status <= 200 && status < 300) || status === 404;
        },
      })
      return response.status === 404 ? [] : [response.data]
    },
    getKey(item) {
      return item.Id
    },
    autoIndex: 'eager',
    defaultIndexType: BasicIndex
  })
)

defineSearch(artistsAlleyOwnCollection, {
  keys: ['DisplayName', 'ShortDescription'],
})

export async function artistsAlleyOwnRegister(data: EfRegisterTable) {
  await registerTable(data)
  await queryClient.invalidateQueries({
    queryKey: ['artists-alley'],
  })
}

export async function artistsAlleyOwnCheckout() {
  await api.delete(`/ArtistsAlley/TableRegistration/:my-latest`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  await queryClient.invalidateQueries({
    queryKey: ['artists-alley'],
  })
}
