import { createContext, ReactNode, useContext, useMemo } from 'react'
import Fuse, { FuseOptionKey, IFuseOptions } from 'fuse.js'
import { flatten } from 'lodash'
import { useCache } from '@/context/data/DataCache'
import {
    AnnouncementDetails, CommunicationDetails,
    DealerDetails,
    EventDayDetails,
    EventDetails,
    EventRoomDetails,
    EventTrackDetails,
    ImageDetails,
    KnowledgeEntryDetails,
    KnowledgeGroupDetails, MapDetails,
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

export type GlobalSearchResult =
    (DealerDetails & { type: 'dealer' })
    | (EventDetails & { type: 'event' })
    | (KnowledgeEntryDetails & { type: 'knowledgeEntry' });

const globalSearchProperties: FuseOptionKey<GlobalSearchResult>[] = [
    ...dealersSearchProperties as any,
    ...eventsSearchProperties as any,
    ...knowledgeEntriesSearchProperties as any,
]

const useFuseMemo = <T, >(data: T[], options: IFuseOptions<any>, properties: FuseOptionKey<T>[]) =>
    useMemo(() => new Fuse(data, options, Fuse.createIndex(properties, data)), [data, options, properties])

export type DataStateContextType = {
    announcements: AnnouncementDetails[];
    dealers: DealerDetails[];
    images: ImageDetails[];
    events: EventDetails[];
    eventDays: EventDayDetails[];
    eventRooms: EventRoomDetails[];
    eventTracks: EventTrackDetails[];
    knowledgeGroups: KnowledgeGroupDetails[];
    knowledgeEntries: KnowledgeEntryDetails[];
    maps: MapDetails[];
    communications: CommunicationDetails[];

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

const DataStateContext = createContext<DataStateContextType | undefined>(undefined)
DataStateContext.displayName = 'DataStateContext'

export const DataStateProvider = ({ children }: { children?: ReactNode | undefined }) => {
    const { getEntityValues } = useCache()


    const announcements = getEntityValues('announcements')
    const dealers = getEntityValues('dealers')
    const images = getEntityValues('images')
    const events = getEntityValues('events')
    const eventDays = getEntityValues('eventDays')
    const eventRooms = getEntityValues('eventRooms')
    const eventTracks = getEntityValues('eventTracks')
    const knowledgeGroups = getEntityValues('knowledgeGroups')
    const knowledgeEntries = getEntityValues('knowledgeEntries')
    const maps = getEntityValues('maps')
    const communications = getEntityValues('communications')

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

    const eventsByDay = useMemo(() =>
        Object.fromEntries(eventDays.map(day => [day.Id, events.filter(item => item.ConferenceDayId === day.Id)])), [eventDays, events])
    const eventsFavorite = useMemo(() => events.filter(item => item.Favorite), [events])
    const dealersFavorite = useMemo(() => dealers.filter(item => item.Favorite), [dealers])
    const dealersInAfterDark = useMemo(() => dealers.filter(item => item.IsAfterDark), [dealers])
    const dealersInRegular = useMemo(() => dealers.filter(item => !item.IsAfterDark), [dealers])

    const searchEvents = useFuseMemo(events, searchOptions, eventsSearchProperties)
    const searchEventsFavorite = useFuseMemo(eventsFavorite, searchOptions, eventsSearchProperties)
    const searchEventsByDay = useMemo(() =>
        Object.fromEntries(Object.entries(eventsByDay).map(([key, value]) =>
            [key, new Fuse(value, searchOptions, Fuse.createIndex(eventsSearchProperties, value))],
        )), [eventsByDay])

    const searchDealers = useFuseMemo(dealers, searchOptions, dealersSearchProperties)
    const searchDealersFavorite = useFuseMemo(dealersFavorite, searchOptions, dealersSearchProperties)
    const searchDealersInAfterDark = useFuseMemo(dealersInAfterDark, searchOptions, dealersSearchProperties)
    const searchDealersInRegular = useFuseMemo(dealersInRegular, searchOptions, dealersSearchProperties)

    const searchKnowledgeEntries = useFuseMemo(knowledgeEntries, searchOptions, knowledgeEntriesSearchProperties)
    const searchAnnouncements = useFuseMemo(announcements, searchOptions, announcementsSearchProperties)

    const searchGlobal = useFuseMemo(global, searchOptionsGlobal, globalSearchProperties)

    const contextValue = useMemo((): DataStateContextType => ({
        // Base lists.
        announcements,
        dealers,
        images,
        events,
        eventDays,
        eventRooms,
        eventTracks,
        knowledgeGroups,
        knowledgeEntries,
        maps,
        communications,

        // Extra event data.
        eventsByDay,
        eventsFavorite,

        // Extra dealer data.
        dealersFavorite,
        dealersInAfterDark,
        dealersInRegular,

        // Common search.
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
    }), [announcements, communications, dealers, dealersFavorite, dealersInAfterDark, dealersInRegular, eventDays, eventRooms, eventTracks, events, eventsByDay, eventsFavorite, images, knowledgeEntries, knowledgeGroups, maps, searchAnnouncements, searchDealers, searchDealersFavorite, searchDealersInAfterDark, searchDealersInRegular, searchEvents, searchEventsByDay, searchEventsFavorite, searchGlobal, searchKnowledgeEntries])

    return <DataStateContext.Provider value={contextValue}>
        {children}
    </DataStateContext.Provider>
}

export const useDataState = () => {
    const context = useContext(DataStateContext)
    if (!context)
        throw new Error('useDataState must be used within a DataStateProvider')
    return context
}
