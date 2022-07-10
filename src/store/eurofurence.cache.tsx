import { createEntityAdapter, createSlice, EntityAdapter, EntityState, PayloadAction } from "@reduxjs/toolkit";
import { modelId } from "expo-device";
import moment from "moment";

import { enrichDealerRecord, enrichImageRecord, enrichMapRecord } from "./eurofurence.enrichers";
import {
    AnnouncementRecord,
    DealerRecord,
    EnrichedDealerRecord,
    EnrichedImageRecord,
    EnrichedMapRecord,
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
    StorageDeltaStartChagneDAteTimeUtc: string;
    RemoveAllEntitiesBeforeInsert: string;
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

export const imagesAdapter = createEntityAdapter<EnrichedImageRecord>({
    selectId: (model) => model.Id,
});

export const dealersAdapter = createEntityAdapter<EnrichedDealerRecord>({
    selectId: (model) => model.Id,
});

export const announcementsAdapter = createEntityAdapter<AnnouncementRecord>({
    selectId: (model) => model.Id,
    sortComparer: (a, b) => a.ValidUntilDateTimeUtc.localeCompare(b.ValidUntilDateTimeUtc),
});

export const mapsAdapter = createEntityAdapter<EnrichedMapRecord>({
    selectId: (model) => model.Id,
});
type EurofurenceCacheState = {
    lastSynchronised: string;
    state: "uninitialized" | "preview" | string;
    events: EntityState<EventRecord>;
    eventDays: EntityState<EventDayRecord>;
    eventRooms: EntityState<EventRoomRecord>;
    eventTracks: EntityState<EventRoomRecord>;
    knowledgeGroups: EntityState<KnowledgeGroupRecord>;
    knowledgeEntries: EntityState<KnowledgeEntryRecord>;
    images: EntityState<EnrichedImageRecord>;
    dealers: EntityState<EnrichedDealerRecord>;
    announcements: EntityState<AnnouncementRecord>;
    maps: EntityState<EnrichedMapRecord>;
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

const syncEntities = <StateType, OriginalType = StateType>(
    state: EntityState<StateType>,
    adapter: EntityAdapter<StateType>,
    delta: EntitySyncState<OriginalType extends StateType ? StateType : OriginalType>,
    transformer: ((it: OriginalType) => StateType) | undefined
) => {
    if (delta.RemoveAllEntitiesBeforeInsert) {
        adapter.removeAll(state);
    }

    if (delta.ChangedEntities) {
        // @ts-expect-error dunno how to actually type this
        const transformed: StateType[] = transformer ? delta.ChangedEntities.map(transformer) : delta.ChangedEntities;
        adapter.upsertMany(state, transformed);
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

            syncEntities(state.events, eventsAdapter, action.payload.Events, undefined);
            syncEntities(state.eventDays, eventDaysAdapter, action.payload.EventConferenceDays, undefined);
            syncEntities(state.eventRooms, eventRoomsAdapter, action.payload.EventConferenceRooms, undefined);
            syncEntities(state.eventTracks, eventTracksAdapter, action.payload.EventConferenceTracks, undefined);
            syncEntities(state.knowledgeGroups, knowledgeGroupsAdapter, action.payload.KnowledgeGroups, undefined);
            syncEntities(state.knowledgeEntries, knowledgeEntriesAdapter, action.payload.KnowledgeEntries, undefined);
            syncEntities(state.dealers, dealersAdapter, action.payload.Dealers, enrichDealerRecord);
            syncEntities(state.images, imagesAdapter, action.payload.Images, enrichImageRecord);
            syncEntities(state.announcements, announcementsAdapter, action.payload.Announcements, undefined);
            syncEntities(state.maps, mapsAdapter, action.payload.Maps, enrichMapRecord);
        },
    },
});

export const { applySync } = eurofurenceCache.actions;
