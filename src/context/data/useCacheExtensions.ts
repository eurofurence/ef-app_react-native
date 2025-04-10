import { useMemo } from 'react'
import { toZonedTime } from 'date-fns-tz'
import { parseISO } from 'date-fns'
import Fuse, { FuseOptionKey, IFuseOptions } from 'fuse.js'
import { chain, flatten } from 'lodash'
import { StoreData } from '@/context/data/Cache'
import { conTimeZone } from '@/configuration'
import {
    internalAttendanceDayNames,
    internalAttendanceDays,
    internalCategorizeTime, internalCreateCategoryMapper,
    internalDealerParseDescriptionContent,
    internalDealerParseTable,
    internalFixedTitle, internalHosts,
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
    ImageDetails, ImageLocation,
    KnowledgeEntryDetails,
    KnowledgeEntryRecord,
    KnowledgeGroupDetails,
    MapDetails,
    MapRecord,
} from '@/context/data/types'
import { EntityStore, filterEntityStore, mapEntityStore } from '@/context/data/EntityStore'


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

/**
 * Returns a memoized Fuse instance for the given data.
 * @param data The data to index.
 * @param options The search options.
 * @param properties The indexing properties.
 */
function useFuseMemo<T, >(data: readonly T[], options: IFuseOptions<any>, properties: FuseOptionKey<T>[]) {
    return useMemo(() => new Fuse(data, options, Fuse.createIndex(properties, data)), [data, options, properties])
}

/**
 * Returns a memoized map of keys to Fuse instances for the given record.
 * @param data The record to index.
 * @param options The search options.
 * @param properties The indexing properties.
 */
function useFuseRecordMemo<T, >(data: Readonly<Record<string, readonly T[]>>, options: IFuseOptions<any>, properties: FuseOptionKey<T>[]) {
    return useMemo(() =>
        Object.fromEntries(Object.entries(data).map(([key, value]) =>
            [key, new Fuse(value, options, Fuse.createIndex(properties, value))],
        )), [data])
}

/**
 * Resolved detailed entity data.
 */
export type CacheExtensions = {
    /**
     * Announcement records with related entity resolution.
     */
    announcements: EntityStore<AnnouncementDetails>;

    /**
     * Dealer records with related entity resolution.
     */
    dealers: EntityStore<DealerDetails>;

    /**
     * Image records with related entity resolution.
     */
    images: EntityStore<ImageDetails>;

    /**
     * Event records with related entity resolution.
     */
    events: EntityStore<EventDetails>;

    /**
     * EventDay records with related entity resolution.
     */
    eventDays: EntityStore<EventDayDetails>;

    /**
     * EventRoom records with related entity resolution.
     */
    eventRooms: EntityStore<EventRoomDetails>;

    /**
     * EventTrack records with related entity resolution.
     */
    eventTracks: EntityStore<EventTrackDetails>;

    /**
     * KnowledgeGroup records with related entity resolution.
     */
    knowledgeGroups: EntityStore<KnowledgeGroupDetails>;

    /**
     * KnowledgeEntry records with related entity resolution.
     */
    knowledgeEntries: EntityStore<KnowledgeEntryDetails>;

    /**
     * Map records with related entity resolution.
     */
    maps: EntityStore<MapDetails>;

    /**
     * Communication records with related entity resolution.
     */
    communications: EntityStore<CommunicationDetails>;

    /**
     * Events that are the user's favorite.
     */
    eventsFavorite: EntityStore<EventDetails>;

    /**
     * Events by the day record ID.
     */
    eventsByDay: Readonly<Record<string, EntityStore<EventDetails>>>

    /**
     * Dealers that are the user's favorite.
     */
    dealersFavorite: EntityStore<DealerDetails>;

    /**
     * Dealers in the after-dark section.
     */
    dealersInAfterDark: EntityStore<DealerDetails>;

    /**
     * Dealers in the regular section.
     */
    dealersInRegular: EntityStore<DealerDetails>;

    /**
     * Fuse instance of events.
     */
    searchEvents: Fuse<EventDetails>;

    /**
     * Fuse instance of favorite events.
     */
    searchEventsFavorite: Fuse<EventDetails>;

    /**
     * Fuse instance by day.
     */
    searchEventsByDay: Readonly<Record<string, Fuse<EventDetails>>>

    /**
     * Fuse instance of dealers.
     */
    searchDealers: Fuse<DealerDetails>;

    /**
     * Fuse instance of favorite dealers.
     */
    searchDealersFavorite: Fuse<DealerDetails>;

    /**
     * Fuse instance of dealers in the after-dark section.
     */
    searchDealersInAfterDark: Fuse<DealerDetails>;

    /**
     * Fuse instance of dealers in the regular section.
     */
    searchDealersInRegular: Fuse<DealerDetails>;

    /**
     * Fuse instance of the knowledge entries.
     */
    searchKnowledgeEntries: Fuse<KnowledgeEntryDetails>;

    /**
     * Fuse instance of announcements.
     */
    searchAnnouncements: Fuse<AnnouncementDetails>;

    /**
     * Fuse instance of mixed events, dealers, and knowledge entries.
     */
    searchGlobal: Fuse<GlobalSearchResult>;

    /**
     * Image record IDs to their use locations.
     */
    imageLocations: Readonly<Record<string, ImageLocation>>;

    eventHosts: readonly string[];

    eventsByHost: Readonly<Record<string, EntityStore<EventDetails>>>
}

/**
 * Internally used by the cache to provide the actual values derived from the
 * storage state.
 * @param data The state to derive from.
 */
export const useCacheExtensions = (data: StoreData): CacheExtensions => {
    // Untransformed entity stores, this is for entities that have no actual
    // details yet, i.e, the detail type is just an alias to the records.
    const images = data.images
    const eventRooms = data.eventRooms
    const eventTracks = data.eventTracks
    const knowledgeGroups = data.knowledgeGroups
    const communications = data.communications

    // Enhanced entity stores. These are extended records with the detail
    // information applied.
    const announcements = useMemo((): EntityStore<AnnouncementDetails> => {
        return mapEntityStore(data.announcements, item => ({
            ...item,
            NormalizedTitle: internalFixedTitle(item.Title, item.Content),
            Image: item.ImageId ? images?.dict?.[item.ImageId] : undefined,
        }))
    }, [images, data.announcements])

    const eventDays = useMemo((): EntityStore<EventDayDetails> => {
        return mapEntityStore(data.eventDays, item => ({
            ...item,
            DayOfWeek: toZonedTime(parseISO(item.Date), conTimeZone).getDay(),
        }))
    }, [data.eventDays])

    const dealers = useMemo((): EntityStore<DealerDetails> => {
        const categoryMapper = internalCreateCategoryMapper(data.dealers)

        return mapEntityStore(data.dealers, item => ({
            ...item,
            CategoryPrimary: categoryMapper(item.Categories),
            AttendanceDayNames: internalAttendanceDayNames(item),
            AttendanceDays: internalAttendanceDays(eventDays, item),
            Artist: item.ArtistImageId ? images?.dict?.[item.ArtistImageId] : undefined,
            ArtistThumbnail: item.ArtistThumbnailImageId ? images?.dict?.[item.ArtistThumbnailImageId] : undefined,
            ArtPreview: item.ArtPreviewImageId ? images?.dict?.[item.ArtPreviewImageId] : undefined,
            ShortDescriptionTable: internalDealerParseTable(item),
            ShortDescriptionContent: internalDealerParseDescriptionContent(item),
            Favorite: Boolean(data.settings.favoriteDealers?.includes(item.Id)),
            MastodonUrl: !item.MastodonHandle ? undefined : internalMastodonHandleToProfileUrl(item.MastodonHandle),
        }))
    }, [eventDays, images, data.dealers, data.settings.favoriteDealers])

    const events = useMemo((): EntityStore<EventDetails> => {
        const favoriteIds = data.notifications?.map(item => item.recordId)
        return mapEntityStore(data.events, (item: EventRecord): EventDetails => ({
            ...item,
            Hosts: internalHosts(item.PanelHosts),
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
    }, [eventDays, eventRooms, eventTracks, images, data.events, data.notifications, data.settings.hiddenEvents])

    const maps = useMemo((): EntityStore<MapDetails> => {
        return mapEntityStore(data.maps, (item: MapRecord): MapDetails => ({
            ...item,
            Image: item.ImageId ? images?.dict?.[item.ImageId] : undefined,
        }))
    }, [images, data.maps])

    const knowledgeEntries = useMemo((): EntityStore<KnowledgeEntryDetails> => {
        return mapEntityStore(data.knowledgeEntries, (item: KnowledgeEntryRecord): KnowledgeEntryDetails => ({
            ...item,
            Images: item.ImageIds.map(item => images?.dict?.[item]).filter(Boolean) as ImageDetails[],
        }))
    }, [images, data.knowledgeEntries])


    // Prefiltered values. These are entity stores for common filter cases.
    const eventsByDay = useMemo(() => {
        return Object.fromEntries(eventDays.map(day => [day.Id, filterEntityStore(events, item => item.ConferenceDayId === day.Id)]))
    }, [eventDays, events])
    const eventsFavorite = useMemo(() => {
        return filterEntityStore(events, item => item.Favorite)
    }, [events])
    const dealersFavorite = useMemo(() => {
        return filterEntityStore(dealers, item => item.Favorite)
    }, [dealers])
    const dealersInAfterDark = useMemo(() => {
        return filterEntityStore(dealers, item => item.IsAfterDark)
    }, [dealers])
    const dealersInRegular = useMemo(() => {
        return filterEntityStore(dealers, item => !item.IsAfterDark)
    }, [dealers])

    // Global entity wrapper, used in searching across multiple entity stores.
    // The results are tagged with their source type.
    const global = useMemo((): GlobalSearchResult[] => {
        const result: GlobalSearchResult[] = new Array<GlobalSearchResult>(events.length + dealers.length + knowledgeEntries.length)
        for (const item of events)
            result.push({ ...item, type: 'event' as const })
        for (const item of dealers)
            result.push({ ...item, type: 'dealer' as const })
        for (const item of knowledgeEntries)
            result.push({ ...item, type: 'knowledgeEntry' as const })
        return result
    }, [events, dealers, knowledgeEntries])

    // Search instances, i.e., all memoized Fuse instances for searching
    // entities by the defined properties.
    const searchEvents = useFuseMemo(events, searchOptions, eventsSearchProperties)
    const searchEventsFavorite = useFuseMemo(eventsFavorite, searchOptions, eventsSearchProperties)
    const searchEventsByDay = useFuseRecordMemo(eventsByDay, searchOptions, eventsSearchProperties)
    const searchDealers = useFuseMemo(dealers, searchOptions, dealersSearchProperties)
    const searchDealersFavorite = useFuseMemo(dealersFavorite, searchOptions, dealersSearchProperties)
    const searchDealersInAfterDark = useFuseMemo(dealersInAfterDark, searchOptions, dealersSearchProperties)
    const searchDealersInRegular = useFuseMemo(dealersInRegular, searchOptions, dealersSearchProperties)
    const searchKnowledgeEntries = useFuseMemo(knowledgeEntries, searchOptions, knowledgeEntriesSearchProperties)
    const searchAnnouncements = useFuseMemo(announcements, searchOptions, announcementsSearchProperties)
    const searchGlobal = useFuseMemo(global, searchOptionsGlobal, globalSearchProperties)

    // Image backreferences. Derived from the base data.
    // As we don't need the extended data here, we can use the "more stable"
    // raw cache data.
    const imageLocations = useMemo(() => {
        const result: Record<string, ImageLocation> = {}
        for (const event of data.events) {
            if (event.PosterImageId) result[event.PosterImageId] = { type: 'Event', location: 'eventPoster', title: event.Title }
            if (event.BannerImageId) result[event.BannerImageId] = { type: 'Event', location: 'eventBanner', title: event.Title }
        }
        for (const dealer of data.dealers) {
            if (dealer.ArtistImageId) result[dealer.ArtistImageId] = { type: 'Dealer', location: 'artist', title: dealer.DisplayNameOrAttendeeNickname }
            if (dealer.ArtistThumbnailImageId)
                result[dealer.ArtistThumbnailImageId] = {
                    type: 'Dealer',
                    location: 'artistThumbnail',
                    title: dealer.DisplayNameOrAttendeeNickname,
                }
            if (dealer.ArtPreviewImageId)
                result[dealer.ArtPreviewImageId] = {
                    type: 'Dealer',
                    location: 'artPreview',
                    title: dealer.DisplayNameOrAttendeeNickname,
                }
        }
        for (const announcement of data.announcements) {
            if (announcement.ImageId) result[announcement.ImageId] = { type: 'Announcement', location: 'announcement', title: announcement.Title }
        }
        for (const knowledgeEntry of data.knowledgeEntries) {
            for (const imageId of knowledgeEntry.ImageIds) {
                result[imageId] = { type: 'KnowledgeEntry', location: 'knowledgeEntryBanner', title: knowledgeEntry.Title }
            }
        }

        return result
    }, [data.events, data.dealers, data.announcements, data.knowledgeEntries])

    // All hosts and map of host to participating events.
    const eventHosts = useMemo(() => chain(events).flatMap(item => item.Hosts).uniq().sort().value(), [events])

    const eventsByHost = useMemo(() => {
        return Object.fromEntries(eventHosts.map(host => [host, filterEntityStore(events, item => item.Hosts.includes(host))]))
    }, [events, eventHosts])

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
        imageLocations,
        eventHosts,
        eventsByHost,
    }
}
