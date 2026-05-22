import {BasicIndex, createCollection, localStorageCollectionOptions} from "@tanstack/react-db";
import type {EfFavoriteDealer} from '@/data/types/EfFavoriteDealer';

export const favoriteDealersCollection = createCollection(localStorageCollectionOptions<EfFavoriteDealer>({
    id: 'favorite-dealers',
    storageKey: 'favorite-dealers',
    getKey: (item) => item.Id,
    autoIndex: 'eager',
    defaultIndexType: BasicIndex
}))
