import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { apiBase } from "../../configuration";
import { getAccessToken } from "../../context/AuthContext";

type NewPrivateMessage = {
    RecipientUid: string;
    AuthorName: string;
    Subject: string;
    Message: string;
};

export const authorizationService = createApi({
    reducerPath: "authorizationService",
    baseQuery: fetchBaseQuery({
        baseUrl: apiBase,
        prepareHeaders: async (headers) => {
            const token = await getAccessToken();
            if (token) headers.set("Authorization", `Bearer ${token}`);
            return headers;
        },
    }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        postDeviceRegistration: builder.mutation<void, { DeviceId: string; DeviceType: string }>({
            query: (args) => ({
                url: "/PushNotifications/FcmDeviceRegistration",
                method: "POST",
                body: {
                    DeviceId: args.DeviceId,
                    DeviceType: args.DeviceType,
                },
            }),
        }),
        createSyncRequest: builder.mutation({
            query: () => ({
                url: "/PushNotifications/SyncRequest",
                method: "POST",
            }),
        }),
        sendPrivateMessage: builder.mutation<string, NewPrivateMessage>({
            query: (args) => ({
                url: "/Communication/PrivateMessages",
                method: "POST",
                body: args,
            }),
        }),
    }),
});

export const { usePostDeviceRegistrationMutation, useCreateSyncRequestMutation, useSendPrivateMessageMutation } = authorizationService;
