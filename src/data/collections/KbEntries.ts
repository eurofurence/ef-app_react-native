import {BasicIndex, createCollection} from "@tanstack/react-db";
import {queryCollectionOptions} from "@tanstack/query-db-collection";
import {api} from '@/data/clients/api';
import {queryClient} from '@/data/clients/query';
import type {EfKbEntry} from '@/data/types/EfKbEntry';

export const kbEntriesCollection = createCollection(
    queryCollectionOptions({
        queryClient,
        queryKey: ['kb-entries'],
        async queryFn() {
            const response = await api.get<EfKbEntry[]>('/KnowledgeEntries');
            return response.data
        },
        getKey(item) {
            return item.Id
        },
        autoIndex: 'eager',
        defaultIndexType: BasicIndex
    })
)
