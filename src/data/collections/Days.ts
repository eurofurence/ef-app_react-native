import {BasicIndex, createCollection} from "@tanstack/react-db";
import {queryCollectionOptions} from "@tanstack/query-db-collection";
import {api} from '@/data/clients/api';
import {queryClient} from '@/data/clients/query';
import type {EfDay} from '@/data/types/EfDay';

export const daysCollection = createCollection(
    queryCollectionOptions({
        queryClient,
        queryKey: ['days'],
        async queryFn({ signal }) {
            const response = await api.get<EfDay[]>('/EventConferenceDays', { signal })
            return response.data
        },
        getKey(item) {
            return item.Id
        },
        // meta: {
        //     authenticated: true
        // }
        autoIndex: 'eager',
        defaultIndexType: BasicIndex
    })
)
