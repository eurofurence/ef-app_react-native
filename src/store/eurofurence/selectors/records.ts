import { createSelector } from "@reduxjs/toolkit";
import { EntitySelectors } from "@reduxjs/toolkit/src/entities/models";
import { groupBy, keyBy, map, mapValues, uniq, Dictionary as LodashDictionary } from "lodash";

import { selectFavoriteDealerIds, selectHiddenEventIds } from "../../auxiliary/selectors";
import { RootState } from "../../index";
import { applyAnnouncementDetails, applyDealerDetails, applyEventDayDetails, applyEventDetails, applyKnowledgeGroupDetails, applyMapDetails } from "../details";
import {
    announcementsAdapter,
    dealersAdapter,
    eventDaysAdapter,
    eventRoomsAdapter,
    eventsAdapter,
    eventTracksAdapter,
    imagesAdapter,
    knowledgeEntriesAdapter,
    knowledgeGroupsAdapter,
    mapsAdapter,
} from "../slice";
import {
    AnnouncementDetails,
    AnnouncementRecord,
    DealerDetails,
    EventDayDetails,
    EventDayRecord,
    EventDetails,
    EventRoomDetails,
    EventTrackDetails,
    ImageDetails,
    KnowledgeEntryDetails,
    KnowledgeGroupDetails,
    KnowledgeGroupRecord,
    MapDetails,
    RecordId,
} from "../types";

type RecordSelectors<T> = EntitySelectors<T, RootState> & {
    selectIds: (state: RootState) => RecordId[];
};

function mapOne<T, U>(value: T | undefined, fn: (value: T) => U): U | undefined {
    if (value === undefined) return undefined;
    else return fn(value);
}

export const eventRoomsSelectors = eventRoomsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.eventRooms) as RecordSelectors<EventRoomDetails>;

export const eventTracksSelectors = eventTracksAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.eventTracks) as RecordSelectors<EventTrackDetails>;

export const baseKnowledgeGroupsSelectors = knowledgeGroupsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.knowledgeGroups);

export const knowledgeGroupsSelectors: RecordSelectors<KnowledgeGroupDetails> = {
    selectTotal: baseKnowledgeGroupsSelectors.selectTotal,
    selectIds: baseKnowledgeGroupsSelectors.selectIds as (state: RootState) => RecordId[],
    selectEntities: createSelector([baseKnowledgeGroupsSelectors.selectEntities], (entities) =>
        mapValues(entities as LodashDictionary<KnowledgeGroupRecord>, applyKnowledgeGroupDetails),
    ),
    selectAll: createSelector([baseKnowledgeGroupsSelectors.selectAll], (all) => map(all, applyKnowledgeGroupDetails)),
    selectById: createSelector([baseKnowledgeGroupsSelectors.selectById], (item) => mapOne(item, applyKnowledgeGroupDetails)),
};

export const knowledgeEntriesSelectors = knowledgeEntriesAdapter.getSelectors<RootState>(
    (state) => state.eurofurenceCache.knowledgeEntries,
) as RecordSelectors<KnowledgeEntryDetails>;

export const imagesSelectors = imagesAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.images) as RecordSelectors<ImageDetails>;

const baseEventDaysSelectors = eventDaysAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.eventDays);
export const eventDaysSelectors: RecordSelectors<EventDayDetails> = {
    selectTotal: baseEventDaysSelectors.selectTotal,
    selectIds: baseEventDaysSelectors.selectIds as (state: RootState) => RecordId[],
    selectEntities: createSelector([baseEventDaysSelectors.selectEntities], (entities) => mapValues(entities as LodashDictionary<EventDayRecord>, applyEventDayDetails)),
    selectAll: createSelector([baseEventDaysSelectors.selectAll], (all) => map(all, applyEventDayDetails)),
    selectById: createSelector([baseEventDaysSelectors.selectById], (item) => mapOne(item, applyEventDayDetails)),
};

const eventRemindersSelector = createSelector([(state: RootState) => state.background.notifications], (notifications) =>
    notifications.filter((notification) => notification.type === "EventReminder"),
);
export const notificationSelector = {
    selectTotal: createSelector([eventRemindersSelector], (notifications) => notifications.length),
    selectRecordIds: createSelector([eventRemindersSelector], (notifications) => uniq(map(notifications, "recordId"))),
    selectEntities: createSelector([eventRemindersSelector], (notifications) => keyBy(notifications, "recordId")),
    selectAllEntities: createSelector([eventRemindersSelector], (notifications) => groupBy(notifications, "recordId")),
    selectAll: createSelector([eventRemindersSelector], (notifications) => notifications),
    selectAllById: createSelector([eventRemindersSelector, (_: RootState, id: RecordId) => id], (notifications, id) =>
        notifications.filter((notification) => notification.recordId === id),
    ),
};

const baseEventsSelector = eventsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.events);
export const eventsSelector: RecordSelectors<EventDetails> = {
    selectTotal: baseEventsSelector.selectTotal,
    selectIds: baseEventsSelector.selectIds as (state: RootState) => RecordId[],
    selectEntities: createSelector(
        [
            baseEventsSelector.selectEntities,
            imagesSelectors.selectEntities,
            eventRoomsSelectors.selectEntities,
            eventDaysSelectors.selectEntities,
            eventTracksSelectors.selectEntities,
            notificationSelector.selectEntities,
            selectHiddenEventIds,
        ],
        (entities, images, rooms, days, tracks, notifications, hiddenIds) =>
            mapValues(entities, (entity) => applyEventDetails(entity!, images, rooms, days, tracks, notifications, hiddenIds)),
    ),
    selectAll: createSelector(
        [
            baseEventsSelector.selectAll,
            imagesSelectors.selectEntities,
            eventRoomsSelectors.selectEntities,
            eventDaysSelectors.selectEntities,
            eventTracksSelectors.selectEntities,
            notificationSelector.selectEntities,
            selectHiddenEventIds,
        ],
        (all, images, rooms, days, tracks, notifications, hiddenIds) => map(all, (entity) => applyEventDetails(entity!, images, rooms, days, tracks, notifications, hiddenIds)),
    ),
    selectById: createSelector(
        [
            baseEventsSelector.selectById,
            imagesSelectors.selectEntities,
            eventRoomsSelectors.selectEntities,
            eventDaysSelectors.selectEntities,
            eventTracksSelectors.selectEntities,
            notificationSelector.selectEntities,
            selectHiddenEventIds,
        ],
        (item, images, rooms, days, tracks, notifications, hiddenIds) => mapOne(item, (entity) => applyEventDetails(entity, images, rooms, days, tracks, notifications, hiddenIds)),
    ),
};

const baseAnnouncementSelectors = announcementsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.announcements);
export const announcementsSelectors: RecordSelectors<AnnouncementDetails> = {
    selectTotal: baseAnnouncementSelectors.selectTotal,
    selectIds: baseAnnouncementSelectors.selectIds as (state: RootState) => RecordId[],
    selectEntities: createSelector([baseAnnouncementSelectors.selectEntities, imagesSelectors.selectEntities], (entities, images) =>
        mapValues(entities as LodashDictionary<AnnouncementRecord>, (entity) => applyAnnouncementDetails(entity, images)),
    ),
    selectAll: createSelector([baseAnnouncementSelectors.selectAll, imagesSelectors.selectEntities], (all, images) =>
        map(all, (entity) => applyAnnouncementDetails(entity, images)),
    ),
    selectById: createSelector([baseAnnouncementSelectors.selectById, imagesSelectors.selectEntities], (item, images) =>
        mapOne(item, (entity) => applyAnnouncementDetails(entity, images)),
    ),
};

const baseMapsSelectors = mapsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.maps);
export const mapsSelectors: RecordSelectors<MapDetails> = {
    selectTotal: baseMapsSelectors.selectTotal,
    selectIds: baseMapsSelectors.selectIds as (state: RootState) => RecordId[],
    selectEntities: createSelector([baseMapsSelectors.selectEntities, imagesSelectors.selectEntities], (entities, images) =>
        mapValues(entities, (entity) => applyMapDetails(entity!, images)),
    ),
    selectAll: createSelector([baseMapsSelectors.selectAll, imagesSelectors.selectEntities], (all, images) => map(all, (entity) => applyMapDetails(entity!, images))),
    selectById: createSelector([baseMapsSelectors.selectById, imagesSelectors.selectEntities], (item, images) => mapOne(item, (entity) => applyMapDetails(entity, images))),
};

const baseDealersSelectors = dealersAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.dealers);
export const dealersSelectors: RecordSelectors<DealerDetails> = {
    selectTotal: baseDealersSelectors.selectTotal,
    selectIds: baseDealersSelectors.selectIds as (state: RootState) => RecordId[],
    selectEntities: createSelector(
        [baseDealersSelectors.selectEntities, imagesSelectors.selectEntities, eventDaysSelectors.selectAll, selectFavoriteDealerIds],
        (entities, images, days, favorites) => mapValues(entities, (entity) => applyDealerDetails(entity!, images, days, favorites)),
    ),
    selectAll: createSelector(
        [baseDealersSelectors.selectAll, imagesSelectors.selectEntities, eventDaysSelectors.selectAll, selectFavoriteDealerIds],
        (all, images, days, favorites) => map(all, (entity) => applyDealerDetails(entity!, images, days, favorites)),
    ),
    selectById: createSelector(
        [baseDealersSelectors.selectById, imagesSelectors.selectEntities, eventDaysSelectors.selectAll, selectFavoriteDealerIds],
        (item, images, days, favorites) => mapOne(item, (entity) => applyDealerDetails(entity, images, days, favorites)),
    ),
};
