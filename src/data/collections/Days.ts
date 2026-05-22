import {BasicIndex, createCollection} from "@tanstack/react-db";
import {queryCollectionOptions} from "@tanstack/query-db-collection";
import {api} from '@/data/clients/api';
import {queryClient} from '@/data/clients/query';
import type {EfDay} from '@/data/types/EfDay';
import {useAuthStore} from '@/data/clients/auth';

export const daysCollection = createCollection(
    queryCollectionOptions({
        queryClient,
        queryKey: ['days'],
        async queryFn() {
            // console.log("FDays", localStorage.auth)
            const token = useAuthStore.getState().token
            const response = await api.get<EfDay[]>('/EventConferenceDays', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
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
