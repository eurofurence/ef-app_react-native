import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import _ from "lodash";
import { REHYDRATE } from "redux-persist";

import { apiBase } from "../configuration";
import {
    AnnouncementRecord,
    CommunicationRecord,
    DealerRecord,
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
    baseQuery: fetchBaseQuery({
        baseUrl: apiBase,
        prepareHeaders: (headers, { getState }) => {
            const token: string | undefined = (getState() as any).authorization?.token;

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: ["Announcement", "Event", "Dealer", "EventDay", "EventTrack", "EventRoom", "Map", "KnowledgeGroup", "KnowledgeEntry", "Image", "Communication"],
    keepUnusedDataFor: 0,
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === REHYDRATE && action.payload) {
            return action.payload[reducerPath];
        }
    },
    endpoints: (builder) => ({
        getAnnouncements: builder.query<AnnouncementRecord[], void>({
            query: () => ({ url: "/Announcements" }),
            providesTags: tagsFromList("Announcement"),
        }),
        getAnnouncementsById: builder.query<AnnouncementRecord, RecordId>({
            query: (args) => ({ url: `/Announcements/${args}` }),
            providesTags: tagsFromItem("Announcement"),
        }),
        getEvents: builder.query<EventRecord[], void>({
            query: () => ({ url: "/Events" }),
            providesTags: tagsFromList("Event"),
        }),
        getEventById: builder.query<EventRecord, RecordId>({
            query: (args) => ({ url: `/Events/${args}` }),
            providesTags: tagsFromItem("Event"),
        }),
        getDealers: builder.query<DealerRecord[], void>({
            query: () => ({ url: "/Dealers" }),
            providesTags: tagsFromList("Dealer"),
        }),
        getDealerById: builder.query<DealerRecord, RecordId>({
            query: (args) => ({ url: `/Dealers/${args}` }),
            providesTags: tagsFromItem("Dealer"),
        }),
        getEventDays: builder.query<EventDayRecord[], void>({
            query: () => ({ url: "/EventConferenceDays" }),
            providesTags: tagsFromList("EventDay"),
        }),
        getEventDayById: builder.query<EventDayRecord, RecordId>({
            query: (args) => ({ url: `/EventConferenceDays/${args}` }),
            providesTags: tagsFromItem("EventDay"),
        }),
        getEventTracks: builder.query<EventTrackRecord[], void>({
            query: () => ({ url: "/EventConferenceTracks" }),
            providesTags: tagsFromList("EventTrack"),
        }),
        getEventTrackById: builder.query<EventTrackRecord, RecordId>({
            query: (args) => ({ url: `/EventConferenceTracks/${args}` }),
            providesTags: tagsFromItem("EventTrack"),
        }),
        getEventRooms: builder.query<EventRoomRecord[], void>({
            query: () => ({ url: "/EventConferenceRooms" }),
            providesTags: tagsFromList("EventRoom"),
        }),
        getEventRoomById: builder.query<EventRoomRecord, RecordId>({
            query: (args) => ({ url: `/EventConferenceRooms/${args}` }),
            providesTags: tagsFromItem("EventRoom"),
        }),
        getMaps: builder.query<MapRecord[], void>({
            query: () => ({ url: "/Maps" }),
            providesTags: tagsFromList("Map"),
        }),
        getMapById: builder.query<MapRecord, RecordId>({
            query: (args) => ({ url: `/Maps/${args}` }),
            providesTags: tagsFromItem("Map"),
        }),
        getKnowledgeGroups: builder.query<KnowledgeGroupRecord[], void>({
            query: () => ({ url: "/KnowledgeGroups" }),
            providesTags: tagsFromList("KnowledgeGroup"),
        }),
        getKnowledgeGroupById: builder.query<KnowledgeGroupRecord, RecordId>({
            query: (args) => ({ url: `/KnowledgeGroups/${args}` }),
            providesTags: tagsFromItem("KnowledgeGroup"),
        }),
        getKnowledgeEntries: builder.query<KnowledgeEntryRecord[], void>({
            query: () => ({ url: "/KnowledgeEntries" }),
            providesTags: tagsFromList("KnowledgeEntry"),
        }),
        getKnowledgeEntryById: builder.query<KnowledgeEntryRecord, RecordId>({
            query: (args) => ({ url: `/KnowledgeEntries/${args}` }),
            providesTags: tagsFromItem("KnowledgeEntry"),
        }),
        getImages: builder.query<ImageRecord[], void>({
            query: () => ({ url: `/Images` }),
            providesTags: tagsFromList("Image"),
        }),
        getCommunications: builder.query<CommunicationRecord[], void>({
            query: () => "/Communication/PrivateMessages",
            providesTags: tagsFromList("Communication"),
            transformResponse: (result: CommunicationRecord[]) => _.orderBy(result, (it) => it.CreatedDateTimeUtc, "desc"),
        }),
        markCommunicationRead: builder.mutation<boolean, RecordId>({
            query: (arg) => ({
                url: `/Communication/PrivateMessages/${arg}/Read`,
                method: "POST",
                headers: {
                    "Content-Type": "text/json",
                },
                body: "true",
                responseHandler: async (response: Response) => response.ok,
            }),
            invalidatesTags: (result, error, arg) => (result ? [{ type: "Communication", id: arg }] : []),
        }),
        submitEventFeedback: builder.mutation<void, { eventId: RecordId; rating: number; message?: string }>({
            query: (args) => ({
                url: "/EventFeedback",
                method: "POST",
                body: {
                    EventId: args.eventId,
                    Rating: args.rating,
                    Message: args.message,
                },
            }),
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
    useGetCommunicationsQuery,
    useMarkCommunicationReadMutation,
    useSubmitEventFeedbackMutation,
} = eurofurenceService;
