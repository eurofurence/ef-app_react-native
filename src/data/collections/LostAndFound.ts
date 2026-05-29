import {BasicIndex, createCollection} from "@tanstack/react-db";
import {queryCollectionOptions} from "@tanstack/query-db-collection";
import {api} from '@/data/clients/api';
import {queryClient} from '@/data/clients/query';
import type {EfLostAndFound} from '@/data/types/EfLostAndFound';

export const lostAndFoundCollection = createCollection(
    queryCollectionOptions({
        queryClient,
        queryKey: ['lost-and-found'],
        async queryFn({ signal }) {
            const response = await api.get<EfLostAndFound[]>("/LostAndFound/Items", { signal });
            return response.data
        },
        getKey(item) {
            return item.Id
        },
        autoIndex: 'eager',
        defaultIndexType: BasicIndex
    })
)
