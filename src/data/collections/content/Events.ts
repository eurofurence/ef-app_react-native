import type {EfFeedbackEvent} from "@/data/types/EfFeedbackEvent";
import {compare} from "@/util/arrays";
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
    meta: {collection: true},
    async queryFn({ signal }) {
      const response = await api.get<EfEvent[]>('/Events', { signal })
      return response.data
    },
    compare(a, b) {
      return compare(a.StartDateTimeUtc, b.StartDateTimeUtc) || compare(a.Id, b.Id)
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

export async function eventsSubmitFeedback(data: EfFeedbackEvent) {
  return await api
    .post(`/EventFeedback`, data, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => res.status === 204)
}
