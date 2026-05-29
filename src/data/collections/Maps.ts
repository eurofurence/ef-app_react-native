import {BasicIndex, createCollection} from "@tanstack/react-db";
import {queryCollectionOptions} from "@tanstack/query-db-collection";
import {api} from '@/data/clients/api';
import {queryClient} from '@/data/clients/query';
import type {EfMap} from '@/data/types/EfMap';

export const mapsCollection = createCollection(
    queryCollectionOptions({
        queryClient,
        queryKey: ['maps'],
        async queryFn({ signal }) {
            const response = await api.get<EfMap[]>("/Maps", { signal });
            return response.data
        },
        getKey(item) {
            return item.Id
        },
        autoIndex: 'eager',
        defaultIndexType: BasicIndex
    })
)
