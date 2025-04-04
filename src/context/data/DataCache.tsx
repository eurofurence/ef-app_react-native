import React, { createContext, ReactNode, useCallback, useContext, useMemo } from 'react'
import { toZonedTime } from 'date-fns-tz'
import { parseISO } from 'date-fns'
import { EntityStore, RawCacheContextType, useRawCache } from '@/context/data/RawCache'
import { conTimeZone } from '@/configuration'
import {
    internalAttendanceDayNames, internalAttendanceDays,
    internalCategorizeTime, internalDealerParseDescriptionContent, internalDealerParseTable,
    internalFixedTitle,
    internalMaskRequired, internalMastodonHandleToProfileUrl, internalSponsorOnly,
    internalSuperSponsorOnly,
    internalTagsToBadges,
    internalTagsToIcon,
} from '@/context/data/DataCache.Utils'
import { emptyArray, emptyDict } from '@/context/data/RawCache.Utils'
import {
    AnnouncementDetails,
    CommunicationDetails,
    DealerDetails,
    EventDayDetails,
    EventDetails,
    EventRecord,
    EventRoomDetails,
    EventTrackDetails,
    ImageDetails,
    KnowledgeEntryDetails, KnowledgeEntryRecord,
    KnowledgeGroupDetails,
    MapDetails,
    MapRecord,
} from '@/context/data/types'

/**
 * Resolved detailed entity data.
 */
export type StoreEntityDetails = {
    announcements: EntityStore<AnnouncementDetails>;
    dealers: EntityStore<DealerDetails>;
    images: EntityStore<ImageDetails>;
    events: EntityStore<EventDetails>;
    eventDays: EntityStore<EventDayDetails>;
    eventRooms: EntityStore<EventRoomDetails>;
    eventTracks: EntityStore<EventTrackDetails>;
    knowledgeGroups: EntityStore<KnowledgeGroupDetails>;
    knowledgeEntries: EntityStore<KnowledgeEntryDetails>;
    maps: EntityStore<MapDetails>;
    communications: EntityStore<CommunicationDetails>;
}

/**
 * (Enhanced) Cache data context.
 * @remarks This retypes the entity methods to return the detailed variants of
 * the entities.
 */
export type DataCacheContextType = Omit<RawCacheContextType, 'getEntityKeys' | 'getEntityValues' | 'getEntityDict' | 'getEntity'> & {
    /**
     * Gets all keys for a given entity by its store name.
     * @param store The name of the store.
     */
    getEntityKeys<T extends keyof StoreEntityDetails>(store: T): StoreEntityDetails[T]['keys'];

    /**
     * Gets all values for a given entity by its store name.
     * @param store The name of the store.
     */
    getEntityValues<T extends keyof StoreEntityDetails>(store: T): StoreEntityDetails[T]['values'];

    /**
     * Gets the associative object for a given entity by its store name.
     * @param store The name of the store.
     */
    getEntityDict<T extends keyof StoreEntityDetails>(store: T): StoreEntityDetails[T]['dict'];

    /**
     * Gets an entity by its store name and key.
     * @param store The name of the store.
     * @param key The ID of the entity.
     */
    getEntity<T extends keyof StoreEntityDetails>(store: T, key: string): StoreEntityDetails[T]['dict'][string] | undefined;
}

/**
 * Context object.
 */
const DataCacheContext = createContext<DataCacheContextType | undefined>(undefined)
DataCacheContext.displayName = 'DataCacheContext'

/**
 * Maps the data of an entity store.
 * @param store The store to map.
 * @param callbackFn The transformation.
 */
function mapEntityStore<T, TResult>(store: EntityStore<T>, callbackFn: (input: T) => TResult): EntityStore<TResult> {
    return {
        keys: store.keys,
        values: store.values.map(callbackFn),
        dict: Object.fromEntries(Object.entries(store.dict).map(([key, value]) => [key, callbackFn(value)])),
    }
}

/**
 * Provides cache integration.
 * @param children The children this context is provided to. May not be rendered
 * if the state is not available yet.
 * @constructor
 */
export const DataCacheProvider = ({ children }: { children?: ReactNode | undefined }) => {
    // Use the raw cache for the un-enhanced data.
    const rawCache = useRawCache()

    // Untransformed entity stores.
    const images: EntityStore<ImageDetails> | undefined = rawCache.cacheData.images
    const eventRooms: EntityStore<EventRoomDetails> | undefined = rawCache.cacheData.eventRooms
    const eventTracks: EntityStore<EventTrackDetails> | undefined = rawCache.cacheData.eventTracks
    const knowledgeGroups: EntityStore<KnowledgeGroupDetails> | undefined = rawCache.cacheData.knowledgeGroups
    const communications: EntityStore<CommunicationDetails> | undefined = rawCache.cacheData.communications

    // Enhanced entity stores.
    const announcements = useMemo((): EntityStore<AnnouncementDetails> | undefined => {
        if (!rawCache.cacheData.announcements) return undefined
        return mapEntityStore(rawCache.cacheData.announcements, item => ({
            ...item,
            NormalizedTitle: internalFixedTitle(item.Title, item.Content),
            Image: item.ImageId ? images?.dict?.[item.ImageId] : undefined,
        }))
    }, [images?.dict, rawCache.cacheData.announcements])

    const eventDays = useMemo((): EntityStore<EventDayDetails> | undefined => {
        if (!rawCache.cacheData.eventDays) return undefined
        return mapEntityStore(rawCache.cacheData.eventDays, item => ({
            ...item,
            DayOfWeek: toZonedTime(parseISO(item.Date), conTimeZone).getDay(),
        }))
    }, [rawCache.cacheData.eventDays])

    const dealers = useMemo((): EntityStore<DealerDetails> | undefined => {
        if (!rawCache.cacheData.dealers) return undefined
        return mapEntityStore(rawCache.cacheData.dealers, item => ({
            ...item,
            AttendanceDayNames: internalAttendanceDayNames(item),
            AttendanceDays: internalAttendanceDays(eventDays?.values ?? [], item),
            Artist: item.ArtistImageId ? images?.dict?.[item.ArtistImageId] : undefined,
            ArtistThumbnail: item.ArtistThumbnailImageId ? images?.dict?.[item.ArtistThumbnailImageId] : undefined,
            ArtPreview: item.ArtPreviewImageId ? images?.dict?.[item.ArtPreviewImageId] : undefined,
            ShortDescriptionTable: internalDealerParseTable(item),
            ShortDescriptionContent: internalDealerParseDescriptionContent(item),
            Favorite: Boolean(rawCache.cacheData.settings?.favoriteDealers?.includes(item.Id)),
            MastodonUrl: !item.MastodonHandle ? undefined : internalMastodonHandleToProfileUrl(item.MastodonHandle),
        }))
    }, [eventDays, images?.dict, rawCache.cacheData.dealers, rawCache.cacheData.settings?.favoriteDealers])

    const events = useMemo((): EntityStore<EventDetails> | undefined => {
        if (!rawCache.cacheData.events) return undefined
        const favoriteIds = rawCache.cacheData.notifications?.map(item => item.recordId)
        return mapEntityStore(rawCache.cacheData.events, (item: EventRecord): EventDetails => ({
            ...item,
            PartOfDay: internalCategorizeTime(item.StartDateTimeUtc),
            Poster: item.PosterImageId ? images?.dict?.[item.PosterImageId] : undefined,
            Banner: item.BannerImageId ? images?.dict?.[item.BannerImageId] : undefined,
            Badges: internalTagsToBadges(item.Tags),
            Glyph: internalTagsToIcon(item.Tags),
            SuperSponsorOnly: internalSuperSponsorOnly(item.Tags),
            SponsorOnly: internalSponsorOnly(item.Tags),
            MaskRequired: internalMaskRequired(item.Tags),
            ConferenceRoom: item.ConferenceRoomId ? eventRooms?.dict?.[item.ConferenceRoomId] : undefined,
            ConferenceDay: item.ConferenceDayId ? eventDays?.dict?.[item.ConferenceDayId] : undefined,
            ConferenceTrack: item.ConferenceTrackId ? eventTracks?.dict?.[item.ConferenceTrackId] : undefined,
            Favorite: Boolean(favoriteIds?.includes(item.Id)),
            Hidden: Boolean(rawCache.cacheData.settings?.hiddenEvents?.includes(item.Id)),
        }))
    }, [eventDays?.dict, eventRooms?.dict, eventTracks?.dict, images?.dict, rawCache.cacheData.events, rawCache.cacheData.notifications, rawCache.cacheData.settings?.hiddenEvents])

    const maps: EntityStore<MapDetails> | undefined = useMemo((): EntityStore<MapDetails> | undefined => {
        if (!rawCache.cacheData.maps) return undefined
        return mapEntityStore(rawCache.cacheData.maps, (item: MapRecord): MapDetails => ({
            ...item,
            Image: item.ImageId ? images?.dict?.[item.ImageId] : undefined,
        }))
    }, [images?.dict, rawCache.cacheData.maps])

    const knowledgeEntries: EntityStore<KnowledgeEntryDetails> | undefined = useMemo((): EntityStore<KnowledgeEntryDetails> | undefined => {
        if (!rawCache.cacheData.knowledgeEntries) return undefined
        return mapEntityStore(rawCache.cacheData.knowledgeEntries, (item: KnowledgeEntryRecord): KnowledgeEntryDetails => ({
            ...item,
            Images: item.ImageIds.map(item => images?.dict?.[item]).filter(Boolean) as ImageDetails[],
        }))
    }, [images?.dict, rawCache.cacheData.knowledgeEntries])

    // Partial for the new entities to access them by their store name from the callbacks.
    const cacheDataDetails = useMemo((): Partial<StoreEntityDetails> => ({
        images,
        eventRooms,
        eventTracks,
        knowledgeGroups,
        knowledgeEntries,
        maps,
        communications,
        announcements,
        eventDays,
        dealers,
        events,
    }), [announcements, communications, dealers, eventDays, eventRooms, eventTracks, events, images, knowledgeEntries, knowledgeGroups, maps])

    // Entity callback remappers.
    const getEntityKeys = useCallback(<T extends keyof StoreEntityDetails>(store: T): StoreEntityDetails[T]['keys'] => {
        return (cacheDataDetails[store]?.keys ?? emptyArray) as StoreEntityDetails[T]['keys']
    }, [cacheDataDetails])
    const getEntityValues = useCallback(<T extends keyof StoreEntityDetails>(store: T): StoreEntityDetails[T]['values'] => {
        return (cacheDataDetails[store]?.values ?? emptyArray) as StoreEntityDetails[T]['values']
    }, [cacheDataDetails])
    const getEntityDict = useCallback(<T extends keyof StoreEntityDetails>(store: T): StoreEntityDetails[T]['dict'] => {
        return cacheDataDetails[store]?.dict ?? emptyDict as StoreEntityDetails[T]['dict']
    }, [cacheDataDetails])
    const getEntity = useCallback(<T extends keyof StoreEntityDetails>(store: T, key: string): StoreEntityDetails[T]['dict'][string] | undefined => {
        return cacheDataDetails[store]?.dict?.[key] as any
    }, [cacheDataDetails])

    // Provided context value.
    const contextValue = useMemo(
        (): DataCacheContextType => ({
            ...rawCache,
            getEntityKeys,
            getEntityValues,
            getEntityDict,
            getEntity,
        }),
        [getEntity, getEntityDict, getEntityKeys, getEntityValues, rawCache],
    )

    return <DataCacheContext.Provider value={contextValue}>
        {children}
    </DataCacheContext.Provider>
}

/**
 * Uses the cache data.
 */
export const useCache = () => {
    const context = useContext(DataCacheContext)
    if (!context)
        throw new Error('useCache must be used within a DataCacheProvider')
    return context
}
