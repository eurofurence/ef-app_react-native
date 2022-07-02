import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import moment from "moment";
import { REHYDRATE } from "redux-persist";

import { AnnouncementRecord, EventRecord, RecordMetadata } from "./eurofurence.types";

const createTags =
    <TagType extends string>(type: TagType) =>
    <ResultType extends RecordMetadata[]>(result: ResultType | undefined) =>
        result ? result.map((it) => ({ type, id: it.Id })) : [type];

export const eurofurenceService = createApi({
    reducerPath: "eurofurenceService",
    keepUnusedDataFor: moment.duration(7, "week").seconds(),
    baseQuery: fetchBaseQuery({ baseUrl: "https://app.eurofurence.org/EF26" }),
    tagTypes: ["Announcement", "Event"],
    extractRehydrationInfo(action, { reducerPath }) {
        if (action.type === REHYDRATE) {
            return action.payload[reducerPath];
        }
    },
    endpoints: (builder) => ({
        getAnnouncements: builder.query<AnnouncementRecord[], void>({
            query: () => ({ url: "/Api/Announcements" }),
            providesTags: createTags("Announcement"),
        }),
        getEvents: builder.query<EventRecord[], void>({
            query: () => ({ url: "/Api/Events" }),
            providesTags: createTags("Event"),
        }),
        getEventById: builder.query<EventRecord, string>({
            query: (args) => ({ url: `/Api/Events/${args}` }),
            providesTags: (result) => createTags("Event")([result]),
        }),
    }),
});

export const { useGetAnnouncementsQuery, useGetEventsQuery, useGetEventByIdQuery } = eurofurenceService;
