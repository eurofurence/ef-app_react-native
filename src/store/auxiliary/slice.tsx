import React, { createContext, useContext, useReducer, useEffect } from "react";
import { useDataCache } from "@/context/DataCacheProvider";
import { RecordId } from "../eurofurence/types";

// Define State Type
type AuxiliaryState = {
    lastViewTimesUtc?: Record<RecordId, string>;
    hiddenEvents?: RecordId[];
    favoriteDealers?: RecordId[];
    deviceWarningsHidden?: boolean;
    languageWarningsHidden?: boolean;
    timeZoneWarningsHidden?: boolean;
};

// Define Actions
type Action =
    | { type: "SET_VIEWED"; payload: { id: RecordId | RecordId[]; nowUtc: string } }
    | { type: "HIDE_EVENT"; payload: RecordId }
    | { type: "UNHIDE_EVENT"; payload: RecordId }
    | { type: "TOGGLE_EVENT_HIDDEN"; payload: RecordId }
    | { type: "UNHIDE_ALL_EVENTS" }
    | { type: "FAVORITE_DEALER"; payload: RecordId }
    | { type: "UNFAVORITE_DEALER"; payload: RecordId }
    | { type: "TOGGLE_DEALER_FAVORITE"; payload: RecordId }
    | { type: "HIDE_DEVICE_WARNINGS" }
    | { type: "SHOW_DEVICE_WARNINGS" }
    | { type: "TOGGLE_SHOW_DEVICE_WARNINGS" }
    | { type: "HIDE_LANGUAGE_WARNINGS" }
    | { type: "SHOW_LANGUAGE_WARNINGS" }
    | { type: "TOGGLE_SHOW_LANGUAGE_WARNINGS" }
    | { type: "TOGGLE_DEVICE_WARNINGS" }
    | { type: "HIDE_TIMEZONE_WARNINGS" }
    | { type: "SHOW_TIMEZONE_WARNINGS" }
    | { type: "TOGGLE_SHOW_TIMEZONE_WARNINGS" };

// Initial State
const initialState: AuxiliaryState = {
    lastViewTimesUtc: {},
    hiddenEvents: [],
    favoriteDealers: [],
    deviceWarningsHidden: false,
    languageWarningsHidden: false,
    timeZoneWarningsHidden: false,
};

// Reducer Function
const auxiliaryReducer = (state: AuxiliaryState, action: Action): AuxiliaryState => {
    switch (action.type) {
        case "SET_VIEWED":
            const { id, nowUtc } = action.payload;
            return {
                ...state,
                lastViewTimesUtc: {
                    ...state.lastViewTimesUtc,
                    ...(Array.isArray(id) ? Object.fromEntries(id.map((singleId) => [singleId, nowUtc])) : { [id]: nowUtc }),
                },
            };

        case "HIDE_EVENT":
            return { ...state, hiddenEvents: [...(state.hiddenEvents || []), action.payload] };

        case "UNHIDE_EVENT":
            return { ...state, hiddenEvents: state.hiddenEvents?.filter((eventId) => eventId !== action.payload) };

        case "TOGGLE_EVENT_HIDDEN":
            return {
                ...state,
                hiddenEvents: state.hiddenEvents?.includes(action.payload)
                    ? state.hiddenEvents.filter((eventId) => eventId !== action.payload)
                    : [...(state.hiddenEvents || []), action.payload],
            };

        case "UNHIDE_ALL_EVENTS":
            return { ...state, hiddenEvents: [] };

        case "FAVORITE_DEALER":
            return { ...state, favoriteDealers: [...(state.favoriteDealers || []), action.payload] };

        case "UNFAVORITE_DEALER":
            return { ...state, favoriteDealers: state.favoriteDealers?.filter((dealerId) => dealerId !== action.payload) };

        case "TOGGLE_DEALER_FAVORITE":
            return {
                ...state,
                favoriteDealers: state.favoriteDealers?.includes(action.payload)
                    ? state.favoriteDealers.filter((dealerId) => dealerId !== action.payload)
                    : [...(state.favoriteDealers || []), action.payload],
            };

        case "HIDE_DEVICE_WARNINGS":
            return { ...state, deviceWarningsHidden: true };

        case "SHOW_DEVICE_WARNINGS":
            return { ...state, deviceWarningsHidden: false };

        case "TOGGLE_SHOW_DEVICE_WARNINGS":
            return { ...state, deviceWarningsHidden: !state.deviceWarningsHidden };

        case "HIDE_LANGUAGE_WARNINGS":
            return { ...state, languageWarningsHidden: true };

        case "SHOW_LANGUAGE_WARNINGS":
            return { ...state, languageWarningsHidden: false };

        case "TOGGLE_SHOW_LANGUAGE_WARNINGS":
            return { ...state, languageWarningsHidden: !state.languageWarningsHidden };

        case "TOGGLE_DEVICE_WARNINGS":
            return { ...state, deviceWarningsHidden: !state.deviceWarningsHidden };

        case "HIDE_TIMEZONE_WARNINGS":
            return { ...state, timeZoneWarningsHidden: true };

        case "SHOW_TIMEZONE_WARNINGS":
            return { ...state, timeZoneWarningsHidden: false };

        case "TOGGLE_SHOW_TIMEZONE_WARNINGS":
            return { ...state, timeZoneWarningsHidden: !state.timeZoneWarningsHidden };

        default:
            return state;
    }
};

// Context
const AuxiliaryContext = createContext<{ state: AuxiliaryState; dispatch: React.Dispatch<Action> } | undefined>(undefined);

// Provider Component
export const AuxiliaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(auxiliaryReducer, initialState);
    const { getCache, saveCache } = useDataCache();

    // Load from Cache
    useEffect(() => {
        const loadState = async () => {
            try {
                const lastViewCache = await getCache("auxiliary", "lastViewTimesUtc");
                if (lastViewCache && lastViewCache.data) {
                    dispatch({
                        type: "SET_VIEWED",
                        payload: {
                            id: Object.keys(lastViewCache.data),
                            nowUtc: lastViewCache.data.toString(),
                        },
                    });
                }
            } catch (error) {
                console.error("Error loading initial cache", error);
            }
        };

        loadState().then();
    }, [getCache]);

    // Save to Cache
    useEffect(() => {
        const saveState = async () => {
            try {
                saveCache("auxiliary", "lastViewTimesUtc", state.lastViewTimesUtc || {});
            } catch (error) {
                console.error("Error saving cache", error);
            }
        };

        saveState().then();
    }, [state, saveCache]);

    return <AuxiliaryContext.Provider value={{ state, dispatch }}>{children}</AuxiliaryContext.Provider>;
};

// Custom Hook
export const useAuxiliary = () => {
    const context = useContext(AuxiliaryContext);
    if (!context) {
        throw new Error("useAuxiliary must be used within an AuxiliaryProvider");
    }
    return context;
};
