import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import { createApi, fetchBaseQuery, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import * as FileSystem from "expo-file-system";
import { FileSystemSessionType, FileSystemUploadType } from "expo-file-system";
import _ from "lodash";

import { ArtistAlleyOwnTableRegistrationRecord, CommunicationRecord, RecordId, RecordMetadata } from "./types";
import { apiBase } from "../../configuration";
import { getAccessToken } from "../../context/AuthContext";
import { httpStatusTexts } from "../../util/httpStatusTexts";

const tagsFromList =
    <TagType extends string>(type: TagType) =>
    <ResultType extends RecordMetadata[]>(result: ResultType | undefined) =>
        result ? result.map((it) => ({ type, id: it.Id })) : [type];

export const eurofurenceService = createApi({
    reducerPath: "eurofurenceService",
    baseQuery: fetchBaseQuery({
        baseUrl: apiBase,
        prepareHeaders: async (headers) => {
            const token = await getAccessToken();
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ["Communication", "ArtistAlleyOwnTableRegistration"],
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
        artistAlleyOwnTableRegistration: builder.query<ArtistAlleyOwnTableRegistrationRecord | null, void>({
            providesTags: ["ArtistAlleyOwnTableRegistration"],
            async queryFn(_arg, _api, _extraOptions, baseQuery) {
                // Get with default query method.
                const response = await baseQuery("/ArtistsAlley/TableRegistration/:my-latest");
                if (response.error && response.error.status === 404) {
                    // Wrap Not Found responses as null results.
                    return {
                        data: null,
                        error: undefined,
                    };
                } else {
                    // Do not touch other responses.
                    return response as QueryReturnValue<ArtistAlleyOwnTableRegistrationRecord | null, FetchBaseQueryError>;
                }
            },
        }),

        /**
         * Post an artist alley registration. This creates or updates the last one of the caller.
         */
        artistAlleyPostTableRegistrationRequest: builder.mutation<
            boolean,
            {
                /**
                 * Display name of the person registering (todo: ??)
                 */
                displayName: string;

                /**
                 * Website URL.
                 */
                websiteUrl: string;

                /**
                 * Short discription (todo: of what?)
                 */
                shortDescription: string;

                /**
                 * TODO ?????? what location?
                 */
                location: string;

                /**
                 * Telegram handle (todo: with or without @?)
                 */
                telegramHandle: string;

                /**
                 * A local file URI to the file to be uploaded.
                 */
                imageUri: string;
            }
        >({
            async queryFn(args) {
                // Get access token, use to send table request.
                const token = await getAccessToken();

                // Check if uploading a new image or an existing. If existing, download.
                let downloadedUri;
                if (args.imageUri.startsWith("file:")) {
                    downloadedUri = null;
                } else {
                    const fileName = args.imageUri.substring(args.imageUri.lastIndexOf("/") + 1);
                    downloadedUri = FileSystem.cacheDirectory + fileName;
                    await FileSystem.downloadAsync(args.imageUri, downloadedUri, {
                        sessionType: FileSystemSessionType.FOREGROUND,
                    });
                }

                // Upload to registration.
                const response = await FileSystem.uploadAsync(`${apiBase}/ArtistsAlley/TableRegistrationRequest`, downloadedUri ?? args.imageUri, {
                    headers: token
                        ? {
                              Authorization: `Bearer ${token}`,
                          }
                        : {},
                    httpMethod: "POST",
                    sessionType: FileSystemSessionType.FOREGROUND,
                    uploadType: FileSystemUploadType.MULTIPART,
                    fieldName: "requestImageFile",
                    parameters: {
                        DisplayName: args.displayName,
                        WebsiteUrl: args.websiteUrl,
                        ShortDescription: args.shortDescription,
                        Location: args.location,
                        TelegramHandle: args.telegramHandle,
                    },
                });

                // Clean up if a temporary file was downloaded.
                if (downloadedUri) {
                    await FileSystem.deleteAsync(downloadedUri);
                }

                // OK-ish status code, API will likely return 200 or 202.
                if (200 <= response.status && response.status < 300)
                    return {
                        data: true,
                        error: undefined,
                    };

                // Was not OK, return an error.
                return {
                    data: undefined,
                    error: {
                        status: response.status,
                        statusText: httpStatusTexts[response.status.toString() as keyof typeof httpStatusTexts],
                        data: response.body,
                    },
                };
            },
            invalidatesTags: ["ArtistAlleyOwnTableRegistration"],
        }),
    }),
});

export const {
    useGetCommunicationsQuery,
    useMarkCommunicationReadMutation,
    useSubmitEventFeedbackMutation,
    useArtistAlleyOwnTableRegistrationQuery,
    useArtistAlleyPostTableRegistrationRequestMutation,
} = eurofurenceService;
