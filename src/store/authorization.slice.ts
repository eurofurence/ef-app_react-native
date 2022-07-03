import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { authorizationService } from "./authorization.service";
import { TokenRegSysResponse } from "./authorization.types";

type AuthorizationState = {
    token?: string;
    username?: string;
    tokenValidUntil?: string;
    isLoggedIn: boolean;
    isExpired: boolean;
};

export const authorizationSlice = createSlice({
    name: "authorization",
    initialState: {
        isLoggedIn: false,
        isExpired: false,
    } as AuthorizationState,
    reducers: {
        logout: (state) => {
            state.token = undefined;
            state.username = undefined;
            state.tokenValidUntil = undefined;
            state.isLoggedIn = false;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(authorizationService.endpoints.postToken.matchFulfilled, (state, { payload }: { payload: TokenRegSysResponse }) => {
            state.token = payload.Token;
            state.username = payload.Username;
            state.tokenValidUntil = payload.TokenValidUntil;
            state.isLoggedIn = true;
            state.isExpired = false;
        });
    },
});

export const { logout } = authorizationSlice.actions;
