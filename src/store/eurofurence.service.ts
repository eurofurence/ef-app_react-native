import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import _ from "lodash";

import { CommunicationRecord, RecordId, RecordMetadata } from "./eurofurence.types";
import { apiBase } from "../configuration";

const tagsFromList =
    <TagType extends string>(type: TagType) =>
    <ResultType extends RecordMetadata[]>(result: ResultType | undefined) =>
        result ? result.map((it) => ({ type, id: it.Id })) : [type];

export const eurofurenceService = createApi({
    reducerPath: "eurofurenceService",
    baseQuery: fetchBaseQuery({
        baseUrl: apiBase,
        prepareHeaders: (headers, { getState }) => {
            const token: string | undefined = (getState() as any).authorization?.accessToken;
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ["Communication"],
    endpoints: (builder) => ({
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

export const { useGetCommunicationsQuery, useMarkCommunicationReadMutation, useSubmitEventFeedbackMutation } = eurofurenceService;
