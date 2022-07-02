import {configureStore} from "@reduxjs/toolkit";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";

export const store = configureStore({
    reducer: {}
});

// Types for the Store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

// Typed versions of common hooks
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;