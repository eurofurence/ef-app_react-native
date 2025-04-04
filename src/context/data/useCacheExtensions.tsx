// import { useMemo } from 'react'
// import { toZonedTime } from 'date-fns-tz'
// import { parseISO } from 'date-fns'
// import { EntityStore, StoreData } from '@/context/data/RawCache'
// import { conTimeZone } from '@/configuration'
// import {
//     internalAttendanceDayNames, internalAttendanceDays,
//     internalCategorizeTime, internalDealerParseDescriptionContent, internalDealerParseTable,
//     internalFixedTitle,
//     internalMaskRequired, internalMastodonHandleToProfileUrl, internalSponsorOnly,
//     internalSuperSponsorOnly,
//     internalTagsToBadges,
//     internalTagsToIcon,
// } from '@/context/data/DataCache.Utils'
//
// import {
//     AnnouncementDetails,
//     CommunicationDetails,
//     DealerDetails,
//     EventDayDetails,
//     EventDetails,
//     EventRecord,
//     EventRoomDetails,
//     EventTrackDetails,
//     ImageDetails,
//     KnowledgeEntryDetails, KnowledgeEntryRecord,
//     KnowledgeGroupDetails,
//     MapDetails,
//     MapRecord,
// } from '@/context/data/types'
// import Fuse, { FuseOptionKey, IFuseOptions } from 'fuse.js'
// import { flatten } from 'lodash'
//
//
// const searchOptions: IFuseOptions<any> = {
//     shouldSort: true,
//     threshold: 0.25,
//     ignoreLocation: true,
// }
//
// const searchOptionsGlobal: IFuseOptions<any> = {
//     ...searchOptions,
//     threshold: 0.1,
// }
//
// const dealersSearchProperties: FuseOptionKey<DealerDetails>[] = [
//     { name: 'DisplayNameOrAttendeeNickname', weight: 2 },
//     { name: 'Categories', weight: 1 },
//     {
//         name: 'Keywords',
//         getFn: (details) => (details.Keywords ? flatten(Object.values(details.Keywords)) : []),
//         weight: 1,
//     },
//     { name: 'ShortDescription', weight: 1 },
//     { name: 'AboutTheArtistText', weight: 1 },
//     { name: 'AboutTheArtText', weight: 1 },
// ]
//
// const eventsSearchProperties: FuseOptionKey<EventDetails>[] = [
//     { name: 'Title', weight: 2 },
//     { name: 'SubTitle', weight: 1 },
//     { name: 'Abstract', weight: 0.5 },
//     { name: 'ConferenceRoom.Name', weight: 0.333 },
//     { name: 'ConferenceTrack.Name', weight: 0.333 },
//     { name: 'Abstract', weight: 0.5 },
//     { name: 'PanelHosts', weight: 0.1 },
// ]
//
// const knowledgeEntriesSearchProperties: FuseOptionKey<KnowledgeEntryDetails>[] = [
//     { name: 'Title', weight: 1.5 },
//     { name: 'Text', weight: 1 },
// ]
//
// const announcementsSearchProperties: FuseOptionKey<AnnouncementDetails>[] = [
//     { name: 'NormalizedTitle', weight: 1.5 },
//     { name: 'Content', weight: 1 },
//     { name: 'Author', weight: 0.5 },
//     { name: 'Area', weight: 0.5 },
// ]
//
// export type GlobalSearchResult =
//     (DealerDetails & { type: 'dealer' })
//     | (EventDetails & { type: 'event' })
//     | (KnowledgeEntryDetails & { type: 'knowledgeEntry' });
//
// const globalSearchProperties: FuseOptionKey<GlobalSearchResult>[] = [
//     ...dealersSearchProperties as any,
//     ...eventsSearchProperties as any,
//     ...knowledgeEntriesSearchProperties as any,
// ]
//
// const useFuseMemo = <T, >(data: T[], options: IFuseOptions<any>, properties: FuseOptionKey<T>[]) =>
//     useMemo(() => new Fuse(data, options, Fuse.createIndex(properties, data)), [data, options, properties])
//
//
// /**
//  * Resolved detailed entity data.
//  */
// export type CacheExtensions = {
//     announcements: EntityStore<AnnouncementDetails>;
//     dealers: EntityStore<DealerDetails>;
//     images: EntityStore<ImageDetails>;
//     events: EntityStore<EventDetails>;
//     eventDays: EntityStore<EventDayDetails>;
//     eventRooms: EntityStore<EventRoomDetails>;
//     eventTracks: EntityStore<EventTrackDetails>;
//     knowledgeGroups: EntityStore<KnowledgeGroupDetails>;
//     knowledgeEntries: EntityStore<KnowledgeEntryDetails>;
//     maps: EntityStore<MapDetails>;
//     communications: EntityStore<CommunicationDetails>;
//
//     eventsFavorite: EventDetails[];
//     eventsByDay: Record<string, EventDetails[]>
//
//     dealersFavorite: DealerDetails[];
//     dealersInAfterDark: DealerDetails[];
//     dealersInRegular: DealerDetails[];
//
//     searchEvents: Fuse<EventDetails>;
//     searchEventsFavorite: Fuse<EventDetails>;
//     searchEventsByDay: Record<string, Fuse<EventDetails>>
//
//     searchDealers: Fuse<DealerDetails>;
//     searchDealersFavorite: Fuse<DealerDetails>;
//     searchDealersInAfterDark: Fuse<DealerDetails>;
//     searchDealersInRegular: Fuse<DealerDetails>;
//
//     searchKnowledgeEntries: Fuse<KnowledgeEntryDetails>;
//     searchAnnouncements: Fuse<AnnouncementDetails>;
//
//     searchGlobal: Fuse<GlobalSearchResult>;
// }
//
// /**
//  * Maps the data of an entity store.
//  * @param store The store to map.
//  * @param callbackFn The transformation.
//  */
// function mapEntityStore<T, TResult>(store: EntityStore<T>, callbackFn: (input: T) => TResult): EntityStore<TResult> {
//     return {
//         keys: store.keys,
//         values: store.values.map(callbackFn),
//         dict: Object.fromEntries(Object.entries(store.dict).map(([key, value]) => [key, callbackFn(value)])),
//     }
// }
//
// /**
//  * Provides cache integration.
//  * @param children The children this context is provided to. May not be rendered
//  * if the state is not available yet.
//  * @constructor
//  */
// export const useCacheExtensions = ({ cacheData }: { cacheData: Partial<StoreData> }) => {
//     // Untransformed entity stores.
//     const images: EntityStore<ImageDetails> | undefined = cacheData.images
//     const eventRooms: EntityStore<EventRoomDetails> | undefined = cacheData.eventRooms
//     const eventTracks: EntityStore<EventTrackDetails> | undefined = cacheData.eventTracks
//     const knowledgeGroups: EntityStore<KnowledgeGroupDetails> | undefined = cacheData.knowledgeGroups
//     const communications: EntityStore<CommunicationDetails> | undefined = cacheData.communications
//
//     // Enhanced entity stores.
//     const announcements = useMemo((): EntityStore<AnnouncementDetails> | undefined => {
//         if (!cacheData.announcements) return undefined
//         return mapEntityStore(cacheData.announcements, item => ({
//             ...item,
//             NormalizedTitle: internalFixedTitle(item.Title, item.Content),
//             Image: item.ImageId ? images?.dict?.[item.ImageId] : undefined,
//         }))
//     }, [images?.dict, cacheData.announcements])
//
//     const eventDays = useMemo((): EntityStore<EventDayDetails> | undefined => {
//         if (!cacheData.eventDays) return undefined
//         return mapEntityStore(cacheData.eventDays, item => ({
//             ...item,
//             DayOfWeek: toZonedTime(parseISO(item.Date), conTimeZone).getDay(),
//         }))
//     }, [cacheData.eventDays])
//
//     const dealers = useMemo((): EntityStore<DealerDetails> | undefined => {
//         if (!cacheData.dealers) return undefined
//         return mapEntityStore(cacheData.dealers, item => ({
//             ...item,
//             AttendanceDayNames: internalAttendanceDayNames(item),
//             AttendanceDays: internalAttendanceDays(eventDays?.values ?? [], item),
//             Artist: item.ArtistImageId ? images?.dict?.[item.ArtistImageId] : undefined,
//             ArtistThumbnail: item.ArtistThumbnailImageId ? images?.dict?.[item.ArtistThumbnailImageId] : undefined,
//             ArtPreview: item.ArtPreviewImageId ? images?.dict?.[item.ArtPreviewImageId] : undefined,
//             ShortDescriptionTable: internalDealerParseTable(item),
//             ShortDescriptionContent: internalDealerParseDescriptionContent(item),
//             Favorite: Boolean(cacheData.settings?.favoriteDealers?.includes(item.Id)),
//             MastodonUrl: !item.MastodonHandle ? undefined : internalMastodonHandleToProfileUrl(item.MastodonHandle),
//         }))
//     }, [eventDays, images?.dict, cacheData.dealers, cacheData.settings?.favoriteDealers])
//
//     const events = useMemo((): EntityStore<EventDetails> | undefined => {
//         if (!cacheData.events) return undefined
//         const favoriteIds = cacheData.notifications?.map(item => item.recordId)
//         return mapEntityStore(cacheData.events, (item: EventRecord): EventDetails => ({
//             ...item,
//             PartOfDay: internalCategorizeTime(item.StartDateTimeUtc),
//             Poster: item.PosterImageId ? images?.dict?.[item.PosterImageId] : undefined,
//             Banner: item.BannerImageId ? images?.dict?.[item.BannerImageId] : undefined,
//             Badges: internalTagsToBadges(item.Tags),
//             Glyph: internalTagsToIcon(item.Tags),
//             SuperSponsorOnly: internalSuperSponsorOnly(item.Tags),
//             SponsorOnly: internalSponsorOnly(item.Tags),
//             MaskRequired: internalMaskRequired(item.Tags),
//             ConferenceRoom: item.ConferenceRoomId ? eventRooms?.dict?.[item.ConferenceRoomId] : undefined,
//             ConferenceDay: item.ConferenceDayId ? eventDays?.dict?.[item.ConferenceDayId] : undefined,
//             ConferenceTrack: item.ConferenceTrackId ? eventTracks?.dict?.[item.ConferenceTrackId] : undefined,
//             Favorite: Boolean(favoriteIds?.includes(item.Id)),
//             Hidden: Boolean(cacheData.settings?.hiddenEvents?.includes(item.Id)),
//         }))
//     }, [eventDays?.dict, eventRooms?.dict, eventTracks?.dict, images?.dict, cacheData.events, cacheData.notifications, cacheData.settings?.hiddenEvents])
//
//     const maps: EntityStore<MapDetails> | undefined = useMemo((): EntityStore<MapDetails> | undefined => {
//         if (!cacheData.maps) return undefined
//         return mapEntityStore(cacheData.maps, (item: MapRecord): MapDetails => ({
//             ...item,
//             Image: item.ImageId ? images?.dict?.[item.ImageId] : undefined,
//         }))
//     }, [images?.dict, cacheData.maps])
//
//     const knowledgeEntries: EntityStore<KnowledgeEntryDetails> | undefined = useMemo((): EntityStore<KnowledgeEntryDetails> | undefined => {
//         if (!cacheData.knowledgeEntries) return undefined
//         return mapEntityStore(cacheData.knowledgeEntries, (item: KnowledgeEntryRecord): KnowledgeEntryDetails => ({
//             ...item,
//             Images: item.ImageIds.map(item => images?.dict?.[item]).filter(Boolean) as ImageDetails[],
//         }))
//     }, [images?.dict, cacheData.knowledgeEntries])
//
//
//     // Prefiltered values.
//     const eventsByDay = useMemo(() =>
//         Object.fromEntries(eventDays.map(day => [day.Id, events.filter(item => item.ConferenceDayId === day.Id)])), [eventDays, events])
//     const eventsFavorite = useMemo(() => events.filter(item => item.Favorite), [events])
//     const dealersFavorite = useMemo(() => dealers.filter(item => item.Favorite), [dealers])
//     const dealersInAfterDark = useMemo(() => dealers.filter(item => item.IsAfterDark), [dealers])
//     const dealersInRegular = useMemo(() => dealers.filter(item => !item.IsAfterDark), [dealers])
//
//
//     const searchEvents = useFuseMemo(events, searchOptions, eventsSearchProperties)
//     const searchEventsFavorite = useFuseMemo(eventsFavorite, searchOptions, eventsSearchProperties)
//     const searchEventsByDay = useMemo(() =>
//         Object.fromEntries(Object.entries(eventsByDay).map(([key, value]) =>
//             [key, new Fuse(value, searchOptions, Fuse.createIndex(eventsSearchProperties, value))],
//         )), [eventsByDay])
//
//     const searchDealers = useFuseMemo(dealers, searchOptions, dealersSearchProperties)
//     const searchDealersFavorite = useFuseMemo(dealersFavorite, searchOptions, dealersSearchProperties)
//     const searchDealersInAfterDark = useFuseMemo(dealersInAfterDark, searchOptions, dealersSearchProperties)
//     const searchDealersInRegular = useFuseMemo(dealersInRegular, searchOptions, dealersSearchProperties)
//
//     const searchKnowledgeEntries = useFuseMemo(knowledgeEntries, searchOptions, knowledgeEntriesSearchProperties)
//     const searchAnnouncements = useFuseMemo(announcements, searchOptions, announcementsSearchProperties)
//
//     const searchGlobal = useFuseMemo(global, searchOptionsGlobal, globalSearchProperties)
//
//
//
//     // Partial for the new entities to access them by their store name from the callbacks.
//     return useMemo((): Partial<CacheExtensions> => ({
//         images,
//         eventRooms,
//         eventTracks,
//         knowledgeGroups,
//         knowledgeEntries,
//         maps,
//         communications,
//         announcements,
//         eventDays,
//         dealers,
//         events,
//     }), [announcements, communications, dealers, eventDays, eventRooms, eventTracks, events, images, knowledgeEntries, knowledgeGroups, maps])
// }
