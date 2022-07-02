import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore, EmptyObject } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import logger from "redux-logger";
import { persistReducer, persistStore } from "redux-persist";

import { eurofurenceService } from "./eurofurence.service";
import { timeTravelSlice } from "./timetravel.slice";

export const reducers = combineReducers({
    timetravel: timeTravelSlice.reducer,
    [eurofurenceService.reducerPath]: eurofurenceService.reducer,
});

const persistedReducer = persistReducer(
    {
        key: "root",
        version: 1,
        storage: AsyncStorage,
        whitelist: ["timetravel", "eurofurenceService"],
    },
    reducers
);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(eurofurenceService.middleware).concat(logger),
});

export const persistor = persistStore(store);

// Types for the Store
export type RootState = Exclude<ReturnType<typeof store.getState>, EmptyObject | { _persist: any }>;
export type AppDispatch = typeof store.dispatch;

// Typed versions of common hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
