import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthorizationState = {
    accessToken: string | null;
};

const initialState = {
    accessToken: null,
} as AuthorizationState;

export const authorizationSlice = createSlice({
    name: "authorization",
    initialState,
    reducers: {
        setAccessToken: (state, action: PayloadAction<string | null>) => {
            state.accessToken = action.payload;
        },
    },
});

export const { setAccessToken } = authorizationSlice.actions;
