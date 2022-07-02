import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore, EmptyObject } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import logger from "redux-logger";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import autoMergeLevel1 from "redux-persist/es/stateReconciler/autoMergeLevel1";

import { eurofurenceService } from "./eurofurence.service";
import { timeTravelSlice } from "./timetravel.slice";

export const reducers = combineReducers({
    [timeTravelSlice.name]: timeTravelSlice.reducer,
    [eurofurenceService.reducerPath]: eurofurenceService.reducer,
});

const persistedReducer = persistReducer(
    {
        key: "root",
        version: 2,
        storage: AsyncStorage,
        stateReconciler: autoMergeLevel1,
        whitelist: [timeTravelSlice.name, eurofurenceService.reducerPath],
    },
    reducers
);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }).concat(logger, eurofurenceService.middleware),
});

export const persistor = persistStore(store);

// Types for the Store
export type RootState = ReturnType<typeof store.getState>;
export type TestingRootState = Exclude<RootState, EmptyObject | { _persist: any }>;
export type AppDispatch = typeof store.dispatch;

// Typed versions of common hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
