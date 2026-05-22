import {BasicIndex, createCollection} from "@tanstack/react-db";
import {queryCollectionOptions} from "@tanstack/query-db-collection";
import {api} from '@/data/clients/api';
import {queryClient} from '@/data/clients/query';
import type {EfTrack} from '@/data/types/EfTrack';

export const tracksCollection = createCollection(
    queryCollectionOptions({
        queryClient,
        queryKey: ['tracks'],
        async queryFn() {
            const response = await api.get<EfTrack[]>('/EventConferenceTracks')
            return response.data
        },
        getKey(item) {
            return item.Id
        },
        autoIndex: 'eager',
        defaultIndexType: BasicIndex
    })
)
