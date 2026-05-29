import {BasicIndex, createCollection} from "@tanstack/react-db";
import {queryCollectionOptions} from "@tanstack/query-db-collection";
import {api} from '@/data/clients/api';
import {queryClient} from '@/data/clients/query';
import type {EfImage} from '@/data/types/EfImage';

export const imagesCollection = createCollection(
    queryCollectionOptions({
        queryClient,
        queryKey: ['images'],
        async queryFn({ signal }) {
            const response = await api.get<EfImage[]>("/Images", { signal });
            return response.data
        },
        getKey(item) {
            return item.Id
        },
        autoIndex: 'eager',
        defaultIndexType: BasicIndex
    })
)
