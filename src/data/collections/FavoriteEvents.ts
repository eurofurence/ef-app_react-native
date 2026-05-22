import {BasicIndex, createCollection, localStorageCollectionOptions} from "@tanstack/react-db";
import type {EfFavoriteEvent} from '@/data/types/EfFavoriteEvent';

export const favoriteEventsCollection = createCollection(localStorageCollectionOptions<EfFavoriteEvent>({
    id: 'favorite-events',
    storageKey: 'favorite-events',
    getKey: (item) => item.Id,
    autoIndex: 'eager',
    defaultIndexType: BasicIndex
}))
