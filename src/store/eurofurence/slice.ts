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
} from "./types";

export type EntitySyncState<T = unknown> = {
    StorageLastChangeDateTimeUtc: string;
    StorageDeltaStartChangeDateTimeUtc: string;
    RemoveAllBeforeInsert: string;
    ChangedEntities?: T[];
    DeletedEntities?: string[];
};

export type SyncResponse = {
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
    sortComparer: (a, b) => a.StartDateTimeUtc.localeCompare(b.StartDateTimeUtc),
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
    sortComparer: (a, b) => {
        const aFullName = (a.DisplayName || a.AttendeeNickname).toLowerCase();
        const bFullName = (b.DisplayName || b.AttendeeNickname).toLowerCase();
        return aFullName.localeCompare(bFullName);
    },
});

export const announcementsAdapter = createEntityAdapter<AnnouncementRecord>({
    selectId: (model) => model.Id,
    sortComparer: (a, b) => -a.ValidFromDateTimeUtc.localeCompare(b.ValidFromDateTimeUtc),
});

export const mapsAdapter = createEntityAdapter<MapRecord>({
    selectId: (model) => model.Id,
    sortComparer: (a, b) => a.Order - b.Order,
});

type EurofurenceCacheState = {
    lastSynchronised: string;
    cid?: string;
    cacheVersion?: number;
    state: undefined | string;
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
    state: undefined,
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
    if (delta.RemoveAllBeforeInsert) adapter.removeAll(state);
    if (delta.ChangedEntities) adapter.upsertMany(state, delta.ChangedEntities);
    if (delta.DeletedEntities) adapter.removeMany(state, delta.DeletedEntities);
};

const amendEntities = <T>(state: EntityState<T>, adapter: EntityAdapter<T>, value: Partial<T>) => {
    adapter.setAll(
        state,
        adapter
            .getSelectors()
            .selectAll(state)
            .map((item) => ({ ...item, ...value })),
    );
};

const internalPatchDealers = (dealers: EntitySyncState<DealerRecord>) => {
    dealers.ChangedEntities?.forEach((dealer) => {
        if (!dealer.AttendsOnThursday && !dealer.AttendsOnFriday && !dealer.AttendsOnSaturday) {
            dealer.AttendsOnThursday = true;
            dealer.AttendsOnFriday = true;
            dealer.AttendsOnSaturday = true;
        }
    });
};

export const eurofurenceCacheVersion = 2;

export const eurofurenceCache = createSlice({
    name: "eurofurenceCache",
    initialState,
    reducers: {
        applySync: (state, action: PayloadAction<SyncResponse>) => {
            // Convention identifier switched, transfer new one and clear all data irrespective of the clear data flag.
            if (state.cid !== action.payload.ConventionIdentifier || state.cacheVersion !== eurofurenceCacheVersion) {
                state.cid = action.payload.ConventionIdentifier;
                state.cacheVersion = eurofurenceCacheVersion;
                console.log("Clearing old cache data because con ID or cache version changed");
                eventsAdapter.removeAll(state.events);
                eventDaysAdapter.removeAll(state.eventDays);
                eventRoomsAdapter.removeAll(state.eventRooms);
                eventTracksAdapter.removeAll(state.eventTracks);
                knowledgeGroupsAdapter.removeAll(state.knowledgeGroups);
                knowledgeEntriesAdapter.removeAll(state.knowledgeEntries);
                dealersAdapter.removeAll(state.dealers);
                imagesAdapter.removeAll(state.images);
                announcementsAdapter.removeAll(state.announcements);
                mapsAdapter.removeAll(state.maps);
            }
            // Fix locally for now. TODO: Remove when API is fixed.
            internalPatchDealers(action.payload.Dealers);

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
        overwriteUpdateTimes: (state, action: PayloadAction<string>) => {
            const update = { LastChangeDateTimeUtc: action.payload };
            amendEntities(state.events, eventsAdapter, update);
            amendEntities(state.eventDays, eventDaysAdapter, update);
            amendEntities(state.eventRooms, eventRoomsAdapter, update);
            amendEntities(state.eventTracks, eventTracksAdapter, update);
            amendEntities(state.knowledgeGroups, knowledgeGroupsAdapter, update);
            amendEntities(state.knowledgeEntries, knowledgeEntriesAdapter, update);
            amendEntities(state.dealers, dealersAdapter, update);
            amendEntities(state.images, imagesAdapter, update);
            amendEntities(state.announcements, announcementsAdapter, update);
            amendEntities(state.maps, mapsAdapter, update);
        },
    },
});

export const { applySync, resetCache, overwriteUpdateTimes } = eurofurenceCache.actions;
