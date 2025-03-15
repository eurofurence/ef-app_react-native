import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Platform } from "react-native";
import { TypedUseSelectorHook, useDispatch, useSelector, useStore } from "react-redux";
import logger from "redux-logger";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";

import { authorizationService } from "./auth/service";
import { auxiliary } from "./auxiliary/slice";
import { backgroundSlice } from "./background/slice";
import { eurofurenceService } from "./eurofurence/service";
import { eurofurenceCache } from "./eurofurence/slice";
import { settingsSlice } from "./settings/slice";
import { timeTravelSlice } from "./timetravel/slice";

export const reducers = combineReducers({
    [backgroundSlice.name]: backgroundSlice.reducer,
    [timeTravelSlice.name]: timeTravelSlice.reducer,
    [eurofurenceCache.name]: eurofurenceCache.reducer,
    [eurofurenceService.reducerPath]: eurofurenceService.reducer,
    [authorizationService.reducerPath]: authorizationService.reducer,
    [settingsSlice.name]: settingsSlice.reducer,
    [auxiliary.name]: auxiliary.reducer,
});

const persistedReducer = persistReducer(
    {
        key: "root",
        version: 3,
        storage: AsyncStorage,
        whitelist: [timeTravelSlice.name, backgroundSlice.name, eurofurenceCache.name, settingsSlice.name, auxiliary.name],
    },
    reducers,
);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
        const middleware = getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                ignoredPaths: [eurofurenceCache.name],
                warnAfter: 200,
            },
            immutableCheck: false, // TODO: __DEV__
        });

        middleware.push(eurofurenceService.middleware, authorizationService.middleware);

        if (Platform.OS === "web") middleware.push(logger as any);

        return middleware;
    },
});

export const persistor = persistStore(store);

// Types for the Store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed versions of common hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppStore: () => typeof store = useStore;
