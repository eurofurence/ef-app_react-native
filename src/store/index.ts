import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import logger from "redux-logger";

import { eurofurenceService } from "./eurofurence.service";
import { timeTravelSlice } from "./timetravel.slice";

export const reducers = {
    timetravel: timeTravelSlice.reducer,
    [eurofurenceService.reducerPath]: eurofurenceService.reducer,
};

export const store = configureStore({
    reducer: reducers,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(eurofurenceService.middleware).concat(logger),
});

// Types for the Store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed versions of common hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
