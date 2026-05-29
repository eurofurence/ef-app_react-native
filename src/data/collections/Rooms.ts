import {BasicIndex, createCollection} from "@tanstack/react-db";
import {queryCollectionOptions} from "@tanstack/query-db-collection";
import {api} from '@/data/clients/api';
import {queryClient} from '@/data/clients/query';
import type {EfRoom} from '@/data/types/EfRoom';

export const roomsCollection = createCollection(
    queryCollectionOptions({
        queryClient,
        queryKey: ['rooms'],
        async queryFn({ signal }) {
            const response = await api.get<EfRoom[]>("/EventConferenceRooms", { signal });
            return response.data
        },
        getKey(item) {
            return item.Id
        },
        autoIndex: 'eager',
        defaultIndexType: BasicIndex
    })
)
