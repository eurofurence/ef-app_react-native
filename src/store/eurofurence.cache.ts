import { createEntityAdapter, createSlice, EntityAdapter, EntityState, PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";

import {
    AnnouncementRecord,
    DealerRecord,
    EventDayRecord,
    EventRecord,
    EventRoomRecord,
    EventTrackRecord,
    ImageRecord,
    KnowledgeEntryRecord,
    KnowledgeGroupRecord,
    MapRecord,
} from "./eurofurence.types";

type EntitySyncState<T = unknown> = {
    StorageLastChangeDateTimeUtc: string;
    StorageDeltaStartChangeDateTimeUtc: string;
    RemoveAllBeforeInsert: string;
    ChangedEntities?: T[];
    DeletedEntities?: string[];
};

type SyncResponse = {
    ConventionIdentifier: string;
    Since?: string;
    CurrentDateTimeUtc: string;
    State: string;
    Events: EntitySyncState<EventRecord>;
    EventConferenceDays: EntitySyncState<EventDayRecord>;
    EventConferenceRooms: EntitySyncState<EventRoomRecord>;
    EventConferenceTracks: EntitySyncState<EventTrackRecord>;
    KnowledgeGroups: EntitySyncState<KnowledgeGroupRecord>;
    KnowledgeEntries: EntitySyncState<KnowledgeEntryRecord>;
    Images: EntitySyncState<ImageRecord>;
    Dealers: EntitySyncState<DealerRecord>;
    Announcements: EntitySyncState<AnnouncementRecord>;
    Maps: EntitySyncState<MapRecord>;
};

export const eventsAdapter = createEntityAdapter<EventRecord>({
    selectId: (model) => model.Id,
    sortComparer: (a, b) => moment(a.StartDateTimeUtc).subtract(b.StartDateTimeUtc).valueOf(),
});

export const eventDaysAdapter = createEntityAdapter<EventDayRecord>({
    selectId: (model) => model.Id,
    sortComparer: (a, b) => a.Date.localeCompare(b.Date),
});

export const eventRoomsAdapter = createEntityAdapter<EventRoomRecord>({
    selectId: (model) => model.Id,
    sortComparer: (a, b) => (a.Name && b.Name ? a.Name.localeCompare(b.Name) : 0),
});

export const eventTracksAdapter = createEntityAdapter<EventTrackRecord>({
    selectId: (model) => model.Id,
    sortComparer: (a, b) => (a.Name && b.Name ? a.Name.localeCompare(b.Name) : 0),
});

export const knowledgeGroupsAdapter = createEntityAdapter<KnowledgeGroupRecord>({
    selectId: (model) => model.Id,
    sortComparer: (a, b) => a.Order - b.Order,
});

export const knowledgeEntriesAdapter = createEntityAdapter<KnowledgeEntryRecord>({
    selectId: (model) => model.Id,
    sortComparer: (a, b) => a.Order - b.Order,
});

export const imagesAdapter = createEntityAdapter<ImageRecord>({
    selectId: (model) => model.Id,
});

export const dealersAdapter = createEntityAdapter<DealerRecord>({
    selectId: (model) => model.Id,
});

export const announcementsAdapter = createEntityAdapter<AnnouncementRecord>({
    selectId: (model) => model.Id,
    sortComparer: (a, b) => a.ValidUntilDateTimeUtc.localeCompare(b.ValidUntilDateTimeUtc),
});

export const mapsAdapter = createEntityAdapter<MapRecord>({
    selectId: (model) => model.Id,
    sortComparer: (a, b) => a.Order - b.Order,
});

type EurofurenceCacheState = {
    lastSynchronised: string;
    state: "uninitialized" | "preview" | "refreshing" | string;
    events: EntityState<EventRecord>;
    eventDays: EntityState<EventDayRecord>;
    eventRooms: EntityState<EventRoomRecord>;
    eventTracks: EntityState<EventRoomRecord>;
    knowledgeGroups: EntityState<KnowledgeGroupRecord>;
    knowledgeEntries: EntityState<KnowledgeEntryRecord>;
    images: EntityState<ImageRecord>;
    dealers: EntityState<DealerRecord>;
    announcements: EntityState<AnnouncementRecord>;
    maps: EntityState<MapRecord>;
};

const initialState: EurofurenceCacheState = {
    lastSynchronised: moment(0).toISOString(),
    state: "uninitialized",
    events: eventsAdapter.getInitialState(),
    eventDays: eventDaysAdapter.getInitialState(),
    eventRooms: eventRoomsAdapter.getInitialState(),
    eventTracks: eventTracksAdapter.getInitialState(),
    knowledgeGroups: knowledgeGroupsAdapter.getInitialState(),
    knowledgeEntries: knowledgeEntriesAdapter.getInitialState(),
    maps: mapsAdapter.getInitialState(),
    dealers: dealersAdapter.getInitialState(),
    announcements: announcementsAdapter.getInitialState(),
    images: imagesAdapter.getInitialState(),
};

const syncEntities = <T>(state: EntityState<T>, adapter: EntityAdapter<T>, delta: EntitySyncState<T>) => {
    if (delta.RemoveAllBeforeInsert) {
        adapter.removeAll(state);
    }

    if (delta.ChangedEntities) {
        adapter.upsertMany(state, delta.ChangedEntities);
    }

    if (delta.DeletedEntities) {
        adapter.removeMany(state, delta.DeletedEntities);
    }
};

export const eurofurenceCache = createSlice({
    name: "eurofurenceCache",
    initialState,
    reducers: {
        applySync: (state, action: PayloadAction<SyncResponse>) => {
            state.lastSynchronised = action.payload.CurrentDateTimeUtc;
            state.state = action.payload.State;

            syncEntities(state.events, eventsAdapter, action.payload.Events);
            syncEntities(state.eventDays, eventDaysAdapter, action.payload.EventConferenceDays);
            syncEntities(state.eventRooms, eventRoomsAdapter, action.payload.EventConferenceRooms);
            syncEntities(state.eventTracks, eventTracksAdapter, action.payload.EventConferenceTracks);
            syncEntities(state.knowledgeGroups, knowledgeGroupsAdapter, action.payload.KnowledgeGroups);
            syncEntities(state.knowledgeEntries, knowledgeEntriesAdapter, action.payload.KnowledgeEntries);
            syncEntities(state.dealers, dealersAdapter, action.payload.Dealers);
            syncEntities(state.images, imagesAdapter, action.payload.Images);
            syncEntities(state.announcements, announcementsAdapter, action.payload.Announcements);
            syncEntities(state.maps, mapsAdapter, action.payload.Maps);
        },
        resetCache: () => {
            return initialState;
        },
        startCacheSync: (state) => {
            state.state = "refreshing";
        },
    },
});

export const { applySync, resetCache, startCacheSync } = eurofurenceCache.actions;
