import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import logger from "redux-logger";

import { eurofurenceService } from "./eurofurence.service";

export const store = configureStore({
    reducer: {
        [eurofurenceService.reducerPath]: eurofurenceService.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(eurofurenceService.middleware).concat(logger),
});

// Types for the Store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed versions of common hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
