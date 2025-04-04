import { useMemo } from 'react'
import { toZonedTime } from 'date-fns-tz'
import { parseISO } from 'date-fns'
import Fuse, { FuseOptionKey, IFuseOptions } from 'fuse.js'
import { flatten } from 'lodash'
import { EntityStore, StoreData } from '@/context/data/Cache'
import { conTimeZone } from '@/configuration'
import {
    internalAttendanceDayNames,
    internalAttendanceDays,
    internalCategorizeTime,
    internalDealerParseDescriptionContent,
    internalDealerParseTable,
    internalFixedTitle,
    internalMaskRequired,
    internalMastodonHandleToProfileUrl,
    internalSponsorOnly,
    internalSuperSponsorOnly,
    internalTagsToBadges,
    internalTagsToIcon,
} from '@/context/data/internal'

import {
    AnnouncementDetails,
    CommunicationDetails,
    DealerDetails,
    EventDayDetails,
    EventDetails,
    EventRecord,
    EventRoomDetails,
    EventTrackDetails,
    GlobalSearchResult,
    ImageDetails,
    KnowledgeEntryDetails,
    KnowledgeEntryRecord,
    KnowledgeGroupDetails,
    MapDetails,
    MapRecord,
} from '@/context/data/types'


const searchOptions: IFuseOptions<any> = {
    shouldSort: true,
    threshold: 0.25,
    ignoreLocation: true,
}

const searchOptionsGlobal: IFuseOptions<any> = {
    ...searchOptions,
    threshold: 0.1,
}

const dealersSearchProperties: FuseOptionKey<DealerDetails>[] = [
    { name: 'DisplayNameOrAttendeeNickname', weight: 2 },
    { name: 'Categories', weight: 1 },
    {
        name: 'Keywords',
        getFn: (details) => (details.Keywords ? flatten(Object.values(details.Keywords)) : []),
        weight: 1,
    },
    { name: 'ShortDescription', weight: 1 },
    { name: 'AboutTheArtistText', weight: 1 },
    { name: 'AboutTheArtText', weight: 1 },
]

const eventsSearchProperties: FuseOptionKey<EventDetails>[] = [
    { name: 'Title', weight: 2 },
    { name: 'SubTitle', weight: 1 },
    { name: 'Abstract', weight: 0.5 },
    { name: 'ConferenceRoom.Name', weight: 0.333 },
    { name: 'ConferenceTrack.Name', weight: 0.333 },
    { name: 'Abstract', weight: 0.5 },
    { name: 'PanelHosts', weight: 0.1 },
]

const knowledgeEntriesSearchProperties: FuseOptionKey<KnowledgeEntryDetails>[] = [
    { name: 'Title', weight: 1.5 },
    { name: 'Text', weight: 1 },
]

const announcementsSearchProperties: FuseOptionKey<AnnouncementDetails>[] = [
    { name: 'NormalizedTitle', weight: 1.5 },
    { name: 'Content', weight: 1 },
    { name: 'Author', weight: 0.5 },
    { name: 'Area', weight: 0.5 },
]

const globalSearchProperties: FuseOptionKey<GlobalSearchResult>[] = [
    ...dealersSearchProperties as any,
    ...eventsSearchProperties as any,
    ...knowledgeEntriesSearchProperties as any,
]

const useFuseMemo = <T, >(data: readonly T[], options: IFuseOptions<any>, properties: FuseOptionKey<T>[]) =>
    useMemo(() => new Fuse(data, options, Fuse.createIndex(properties, data)), [data, options, properties])


/**
 * Resolved detailed entity data.
 */
export type CacheExtensions = {
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

    eventsFavorite: EventDetails[];
    eventsByDay: Record<string, EventDetails[]>

    dealersFavorite: DealerDetails[];
    dealersInAfterDark: DealerDetails[];
    dealersInRegular: DealerDetails[];

    searchEvents: Fuse<EventDetails>;
    searchEventsFavorite: Fuse<EventDetails>;
    searchEventsByDay: Record<string, Fuse<EventDetails>>

    searchDealers: Fuse<DealerDetails>;
    searchDealersFavorite: Fuse<DealerDetails>;
    searchDealersInAfterDark: Fuse<DealerDetails>;
    searchDealersInRegular: Fuse<DealerDetails>;

    searchKnowledgeEntries: Fuse<KnowledgeEntryDetails>;
    searchAnnouncements: Fuse<AnnouncementDetails>;

    searchGlobal: Fuse<GlobalSearchResult>;
}

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
 * Internally used by the cache to provided the actual values derived from the storage state.
 * @param data The state to derive from.
 */
export const useCacheExtensions = (data: StoreData): CacheExtensions => {
    // Untransformed entity stores.
    const images = data.images
    const eventRooms = data.eventRooms
    const eventTracks = data.eventTracks
    const knowledgeGroups = data.knowledgeGroups
    const communications = data.communications

    // Enhanced entity stores.
    const announcements = useMemo((): EntityStore<AnnouncementDetails> => {
        return mapEntityStore(data.announcements, item => ({
            ...item,
            NormalizedTitle: internalFixedTitle(item.Title, item.Content),
            Image: item.ImageId ? images?.dict?.[item.ImageId] : undefined,
        }))
    }, [images?.dict, data.announcements])

    const eventDays = useMemo((): EntityStore<EventDayDetails> => {
        return mapEntityStore(data.eventDays, item => ({
            ...item,
            DayOfWeek: toZonedTime(parseISO(item.Date), conTimeZone).getDay(),
        }))
    }, [data.eventDays])

    const dealers = useMemo((): EntityStore<DealerDetails> => {
        return mapEntityStore(data.dealers, item => ({
            ...item,
            AttendanceDayNames: internalAttendanceDayNames(item),
            AttendanceDays: internalAttendanceDays(eventDays.values, item),
            Artist: item.ArtistImageId ? images?.dict?.[item.ArtistImageId] : undefined,
            ArtistThumbnail: item.ArtistThumbnailImageId ? images?.dict?.[item.ArtistThumbnailImageId] : undefined,
            ArtPreview: item.ArtPreviewImageId ? images?.dict?.[item.ArtPreviewImageId] : undefined,
            ShortDescriptionTable: internalDealerParseTable(item),
            ShortDescriptionContent: internalDealerParseDescriptionContent(item),
            Favorite: Boolean(data.settings.favoriteDealers?.includes(item.Id)),
            MastodonUrl: !item.MastodonHandle ? undefined : internalMastodonHandleToProfileUrl(item.MastodonHandle),
        }))
    }, [eventDays, images?.dict, data.dealers, data.settings.favoriteDealers])

    const events = useMemo((): EntityStore<EventDetails> => {
        const favoriteIds = data.notifications?.map(item => item.recordId)
        return mapEntityStore(data.events, (item: EventRecord): EventDetails => ({
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
            Hidden: Boolean(data.settings.hiddenEvents?.includes(item.Id)),
        }))
    }, [eventDays?.dict, eventRooms?.dict, eventTracks?.dict, images?.dict, data.events, data.notifications, data.settings.hiddenEvents])

    const maps = useMemo((): EntityStore<MapDetails> => {
        return mapEntityStore(data.maps, (item: MapRecord): MapDetails => ({
            ...item,
            Image: item.ImageId ? images?.dict?.[item.ImageId] : undefined,
        }))
    }, [images?.dict, data.maps])

    const knowledgeEntries = useMemo((): EntityStore<KnowledgeEntryDetails> => {
        return mapEntityStore(data.knowledgeEntries, (item: KnowledgeEntryRecord): KnowledgeEntryDetails => ({
            ...item,
            Images: item.ImageIds.map(item => images?.dict?.[item]).filter(Boolean) as ImageDetails[],
        }))
    }, [images?.dict, data.knowledgeEntries])


    // Prefiltered values.
    const eventsByDay = useMemo(() =>
        Object.fromEntries(eventDays.values.map(day => [day.Id, events.values.filter(item => item.ConferenceDayId === day.Id)])), [eventDays, events])
    const eventsFavorite = useMemo(() => events.values.filter(item => item.Favorite), [events])
    const dealersFavorite = useMemo(() => dealers.values.filter(item => item.Favorite), [dealers])
    const dealersInAfterDark = useMemo(() => dealers.values.filter(item => item.IsAfterDark), [dealers])
    const dealersInRegular = useMemo(() => dealers.values.filter(item => !item.IsAfterDark), [dealers])

    // Global entity wrapper.
    const global = useMemo((): GlobalSearchResult[] => {
        const result: GlobalSearchResult[] = new Array<GlobalSearchResult>(events.values.length + dealers.values.length + knowledgeEntries.values.length)
        for (const item of events.values)
            result.push({ ...item, type: 'event' as const })
        for (const item of dealers.values)
            result.push({ ...item, type: 'dealer' as const })
        for (const item of knowledgeEntries.values)
            result.push({ ...item, type: 'knowledgeEntry' as const })
        return result
    }, [events, dealers, knowledgeEntries])


    const searchEvents = useFuseMemo(events.values, searchOptions, eventsSearchProperties)
    const searchEventsFavorite = useFuseMemo(eventsFavorite, searchOptions, eventsSearchProperties)
    const searchEventsByDay = useMemo(() =>
        Object.fromEntries(Object.entries(eventsByDay).map(([key, value]) =>
            [key, new Fuse(value, searchOptions, Fuse.createIndex(eventsSearchProperties, value))],
        )), [eventsByDay])

    const searchDealers = useFuseMemo(dealers.values, searchOptions, dealersSearchProperties)
    const searchDealersFavorite = useFuseMemo(dealersFavorite, searchOptions, dealersSearchProperties)
    const searchDealersInAfterDark = useFuseMemo(dealersInAfterDark, searchOptions, dealersSearchProperties)
    const searchDealersInRegular = useFuseMemo(dealersInRegular, searchOptions, dealersSearchProperties)

    const searchKnowledgeEntries = useFuseMemo(knowledgeEntries.values, searchOptions, knowledgeEntriesSearchProperties)

    const searchAnnouncements = useFuseMemo(announcements.values, searchOptions, announcementsSearchProperties)

    const searchGlobal = useFuseMemo(global, searchOptionsGlobal, globalSearchProperties)


    // Partial for the new entities to access them by their store name from the callbacks.
    return {
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
        eventsByDay,
        eventsFavorite,
        dealersFavorite,
        dealersInAfterDark,
        dealersInRegular,
        searchEvents,
        searchEventsFavorite,
        searchEventsByDay,
        searchDealers,
        searchDealersFavorite,
        searchDealersInAfterDark,
        searchDealersInRegular,
        searchKnowledgeEntries,
        searchAnnouncements,
        searchGlobal,
    }
}
