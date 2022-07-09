import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { REHYDRATE } from "redux-persist";

import { enrichDealerRecord, enrichImageRecord, enrichMapRecord } from "./eurofurence.enrichers";
import {
    AnnouncementRecord,
    DealerRecord,
    EnrichedDealerRecord,
    EnrichedImageRecord,
    EnrichedMapRecord,
    EventDayRecord,
    EventRecord,
    EventRoomRecord,
    EventTrackRecord,
    ImageRecord,
    KnowledgeEntryRecord,
    KnowledgeGroupRecord,
    MapRecord,
    RecordId,
    RecordMetadata,
} from "./eurofurence.types";

const tagsFromList =
    <TagType extends string>(type: TagType) =>
    <ResultType extends RecordMetadata[]>(result: ResultType | undefined) =>
        result ? result.map((it) => ({ type, id: it.Id })) : [type];
const tagsFromItem =
    <TagType extends string>(type: TagType) =>
    <ResultType extends RecordMetadata>(result: ResultType | undefined) =>
        result ? [{ type, id: result.Id }] : [type];

export const eurofurenceService = createApi({
    reducerPath: "eurofurenceService",
    baseQuery: fetchBaseQuery({ baseUrl: "https://app.eurofurence.org/EF26" }),
    tagTypes: ["Announcement", "Event", "Dealer", "EventDay", "EventTrack", "EventRoom", "Map", "KnowledgeGroup", "KnowledgeEntry", "Image"],
    keepUnusedDataFor: 0,
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === REHYDRATE && action.payload) {
            return action.payload[reducerPath];
        }
    },
    endpoints: (builder) => ({
        getAnnouncements: builder.query<AnnouncementRecord[], void>({
            query: () => ({ url: "/Api/Announcements" }),
            providesTags: tagsFromList("Announcement"),
        }),
        getAnnouncementsById: builder.query<AnnouncementRecord, RecordId>({
            query: (args) => ({ url: `/Api/Announcements/${args}` }),
            providesTags: tagsFromItem("Announcement"),
        }),
        getEvents: builder.query<EventRecord[], void>({
            query: () => ({ url: "/Api/Events" }),
            providesTags: tagsFromList("Event"),
        }),
        getEventById: builder.query<EventRecord, RecordId>({
            query: (args) => ({ url: `/Api/Events/${args}` }),
            providesTags: tagsFromItem("Event"),
        }),
        getDealers: builder.query<EnrichedDealerRecord[], void>({
            query: () => ({ url: "/Api/Dealers" }),
            providesTags: tagsFromList("Dealer"),
            transformResponse: (result: DealerRecord[]): EnrichedDealerRecord[] => result.map(enrichDealerRecord),
        }),
        getDealerById: builder.query<EnrichedDealerRecord, RecordId>({
            query: (args) => ({ url: `/Api/Dealers/${args}` }),
            providesTags: tagsFromItem("Dealer"),
            transformResponse: enrichDealerRecord,
        }),
        getEventDays: builder.query<EventDayRecord[], void>({
            query: () => ({ url: "/Api/EventConferenceDays" }),
            providesTags: tagsFromList("EventDay"),
        }),
        getEventDayById: builder.query<EventDayRecord, RecordId>({
            query: (args) => ({ url: `/Api/EventConferenceDays/${args}` }),
            providesTags: tagsFromItem("EventDay"),
        }),
        getEventTracks: builder.query<EventTrackRecord[], void>({
            query: () => ({ url: "/Api/EventConferenceTracks" }),
            providesTags: tagsFromList("EventTrack"),
        }),
        getEventTrackById: builder.query<EventTrackRecord, RecordId>({
            query: (args) => ({ url: `/Api/EventConferenceTracks/${args}` }),
            providesTags: tagsFromItem("EventTrack"),
        }),
        getEventRooms: builder.query<EventRoomRecord[], void>({
            query: () => ({ url: "/Api/EventConferenceRooms" }),
            providesTags: tagsFromList("EventRoom"),
        }),
        getEventRoomById: builder.query<EventRoomRecord, RecordId>({
            query: (args) => ({ url: `/Api/EventConferenceRooms/${args}` }),
            providesTags: tagsFromItem("EventRoom"),
        }),
        getMaps: builder.query<MapRecord[], void>({
            query: () => ({ url: "/Api/MAps" }),
            providesTags: tagsFromList("Map"),
        }),
        getMapById: builder.query<EnrichedMapRecord, RecordId>({
            query: (args) => ({ url: `/Api/Maps/${args}` }),
            providesTags: tagsFromItem("Map"),
            transformResponse: enrichMapRecord,
        }),
        getKnowledgeGroups: builder.query<KnowledgeGroupRecord[], void>({
            query: () => ({ url: "/Api/KnowledgeGroups" }),
            providesTags: tagsFromList("KnowledgeGroup"),
        }),
        getKnowledgeGroupById: builder.query<KnowledgeGroupRecord, RecordId>({
            query: (args) => ({ url: `/Api/KnowledgeGroups/${args}` }),
            providesTags: tagsFromItem("KnowledgeGroup"),
        }),
        getKnowledgeEntries: builder.query<KnowledgeEntryRecord[], void>({
            query: () => ({ url: "/Api/KnowledgeEntries" }),
            providesTags: tagsFromList("KnowledgeEntry"),
        }),
        getKnowledgeEntryById: builder.query<KnowledgeEntryRecord, RecordId>({
            query: (args) => ({ url: `/Api/KnowledgeEntries/${args}` }),
            providesTags: tagsFromItem("KnowledgeEntry"),
        }),
        getImages: builder.query<EnrichedImageRecord[], void>({
            query: () => ({ url: `/Api/Images` }),
            providesTags: tagsFromList("Image"),
            transformResponse: (result: ImageRecord[]) => result.map(enrichImageRecord),
        }),
    }),
});

export const {
    useGetAnnouncementsQuery,
    useGetEventsQuery,
    useGetEventByIdQuery,
    useGetDealersQuery,
    useGetImagesQuery,
    useGetEventDaysQuery,
    useGetEventDayByIdQuery,
    useGetEventTracksQuery,
    useGetEventTrackByIdQuery,
    useGetEventRoomsQuery,
    useGetEventRoomByIdQuery,
} = eurofurenceService;
