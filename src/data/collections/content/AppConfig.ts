import type {EfAppConfig} from "@/data/types/EfAppConfig";
import {queryCollectionOptions} from '@tanstack/query-db-collection'
import {BasicIndex, createCollection} from '@tanstack/react-db'
import {api} from '@/data/clients/api'
import {queryClient} from '@/data/clients/query'

export const appConfigCollection = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: ['app-config'],
    meta: {collection: true},
    async queryFn({signal}) {
      const response = await api.get<EfAppConfig>(
        '/AppConfig',
        {
          signal,
        }
      )
      return [response.data]
    },
    getKey() {
      return 'singleton'
    },
    autoIndex: 'eager',
    defaultIndexType: BasicIndex,
  })
)
