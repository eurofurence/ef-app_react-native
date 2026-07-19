import type {EfPm} from "@/data/types/EfPm";
import type {EfSendPm} from "@/data/types/EfSendPm";
import {parseDefaultISO} from "@/util/parseDefaultISO";
import {queryCollectionOptions} from '@tanstack/query-db-collection'
import {BasicIndex, createCollection} from '@tanstack/react-db'
import {api} from '@/data/clients/api'
import {queryClient} from '@/data/clients/query'
import {defineSearch} from '@/data/searching/useSearch'

export const pmsCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['pms'],
    meta: {collection: true},
    async queryFn({signal}) {
      // todo: empty with no auth? or covered with invalidation
      const response = await api.get<EfPm[]>('/Communication/PrivateMessages', {
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

defineSearch(pmsCollection, {
  keys: ['Author', 'Title', 'Content'],
})

export async function pmsSend({type, ...message}: EfSendPm) {
  const result = await api
    .post(
      `/Communication/PrivateMessages/:${type ?? 'byRegistrationId'}`,
      message,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    .then((res) => res.data)
  await queryClient.invalidateQueries({
    queryKey: ['pms'],
  })
  return result
}

// todo: tanstack query stuff?
export async function pmsMarkRead(id: unknown) {
  const result = await api
    .post(`/Communication/PrivateMessages/${id}/Read`, true, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => parseDefaultISO(res.data))
  await queryClient.invalidateQueries({
    queryKey: ['pms'],
  })
  return result
}
