import {BasicIndex, createCollection} from "@tanstack/react-db";
import {queryCollectionOptions} from "@tanstack/query-db-collection";
import {api} from '@/data/clients/api';
import {queryClient} from '@/data/clients/query';
import type {EfArtistsAlley} from '@/data/types/EfArtistsAlley';

export const artistsAlleyCollection = createCollection(
    queryCollectionOptions({
        queryClient,
        queryKey: ['artists-alley'],
        async queryFn() {
            const response = await api.get<EfArtistsAlley[]>('/ArtistsAlley');
            return response.data
        },
        getKey(item) {
            return item.Id
        },
        autoIndex: 'eager',
        defaultIndexType: BasicIndex
    })
)
