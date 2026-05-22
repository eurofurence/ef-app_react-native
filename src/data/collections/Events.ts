import {BasicIndex, createCollection} from "@tanstack/react-db";
import {queryCollectionOptions} from "@tanstack/query-db-collection";
import {type EfEvent} from '@/data/types/EfEvent'
import {api} from '@/data/clients/api';
import {queryClient} from '@/data/clients/query';

export const eventsCollection = createCollection(
    queryCollectionOptions({
        queryClient,
        queryKey: ['events'],
        async queryFn() {
            const response = await api.get<EfEvent[]>('/Events')
            return response.data
        },
        getKey(item) {
            return item.Id
        },
        autoIndex: 'eager',
        defaultIndexType: BasicIndex
    })
)
