import { createSelector } from "@reduxjs/toolkit";
import { EntitySelectors } from "@reduxjs/toolkit/src/entities/models";
import _, { chain, Dictionary as LodashDictionary, map, mapValues } from "lodash";
import moment, { Moment } from "moment";
import { SectionListData } from "react-native";

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
} from "./eurofurence.cache";
import { applyAnnouncementDetails, applyDealerDetails, applyEventDayDetails, applyEventDetails, applyImageDetails, applyMapDetails } from "./eurofurence.details";
import {
    AnnouncementDetails,
    AnnouncementRecord,
    AttendanceDay,
    DealerDetails,
    EventDayDetails,
    EventDayRecord,
    EventDetails,
    EventRoomDetails,
    EventTrackDetails,
    ImageDetails,
    ImageRecord,
    KnowledgeEntryDetails,
    KnowledgeEntryRecord,
    KnowledgeGroupDetails,
    KnowledgeGroupRecord,
    LinkFragment,
    MapDetails,
    MapEntryRecord,
    RecordId,
} from "./eurofurence.types";
import { RootState } from "./index";

type RecordSelectors<T> = EntitySelectors<T, RootState> & {
    selectIds: (state: RootState) => RecordId[];
};

function mapOne<T, U>(value: T | undefined, fn: (value: T) => U): U | undefined {
    if (value === undefined) return undefined;
    else return fn(value);
}

export const eventRoomsSelectors = eventRoomsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.eventRooms) as RecordSelectors<EventRoomDetails>;

export const eventTracksSelectors = eventTracksAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.eventTracks) as RecordSelectors<EventTrackDetails>;

export const knowledgeGroupsSelectors = knowledgeGroupsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.knowledgeGroups) as RecordSelectors<KnowledgeGroupDetails>;

export const knowledgeEntriesSelectors = knowledgeEntriesAdapter.getSelectors<RootState>(
    (state) => state.eurofurenceCache.knowledgeEntries,
) as RecordSelectors<KnowledgeEntryDetails>;

const baseImageSelectors = imagesAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.images);
export const imagesSelectors: RecordSelectors<ImageDetails> = {
    selectTotal: baseImageSelectors.selectTotal,
    selectIds: baseImageSelectors.selectIds as (state: RootState) => RecordId[],
    selectEntities: createSelector([baseImageSelectors.selectEntities], (entities) => mapValues(entities as LodashDictionary<ImageRecord>, applyImageDetails)),
    selectAll: createSelector([baseImageSelectors.selectAll], (all) => map(all, applyImageDetails)),
    selectById: createSelector([baseImageSelectors.selectById], (item) => mapOne(item, applyImageDetails)),
};

const baseEventDaysSelectors = eventDaysAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.eventDays);
export const eventDaysSelectors: RecordSelectors<EventDayDetails> = {
    selectTotal: baseEventDaysSelectors.selectTotal,
    selectIds: baseEventDaysSelectors.selectIds as (state: RootState) => RecordId[],
    selectEntities: createSelector([baseEventDaysSelectors.selectEntities], (entities) => mapValues(entities as LodashDictionary<EventDayRecord>, applyEventDayDetails)),
    selectAll: createSelector([baseEventDaysSelectors.selectAll], (all) => map(all, applyEventDayDetails)),
    selectById: createSelector([baseEventDaysSelectors.selectById], (item) => mapOne(item, applyEventDayDetails)),
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
        ],
        (entities, images, rooms, days, tracks) => mapValues(entities, (entity) => applyEventDetails(entity!, images, rooms, days, tracks)),
    ),
    selectAll: createSelector(
        [baseEventsSelector.selectAll, imagesSelectors.selectEntities, eventRoomsSelectors.selectEntities, eventDaysSelectors.selectEntities, eventTracksSelectors.selectEntities],
        (all, images, rooms, days, tracks) => map(all, (entity) => applyEventDetails(entity!, images, rooms, days, tracks)),
    ),
    selectById: createSelector(
        [baseEventsSelector.selectById, imagesSelectors.selectEntities, eventRoomsSelectors.selectEntities, eventDaysSelectors.selectEntities, eventTracksSelectors.selectEntities],
        (item, images, rooms, days, tracks) => mapOne(item, (entity) => applyEventDetails(entity, images, rooms, days, tracks)),
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
    selectEntities: createSelector([baseDealersSelectors.selectEntities, imagesSelectors.selectEntities, eventDaysSelectors.selectAll], (entities, images, days) =>
        mapValues(entities, (entity) => applyDealerDetails(entity!, images, days)),
    ),
    selectAll: createSelector([baseDealersSelectors.selectAll, imagesSelectors.selectEntities, eventDaysSelectors.selectAll], (all, images, days) =>
        map(all, (entity) => applyDealerDetails(entity!, images, days)),
    ),
    selectById: createSelector([baseDealersSelectors.selectById, imagesSelectors.selectEntities, eventDaysSelectors.selectAll], (item, images, days) =>
        mapOne(item, (entity) => applyDealerDetails(entity, images, days)),
    ),
};

export const selectFavoriteEvents = createSelector([eventsSelector.selectEntities, (state: RootState) => state.background.notifications], (events, notifications): EventDetails[] =>
    _.chain(notifications)
        .filter((it) => it.type === "EventReminder")
        .map((it): EventDetails | undefined => events[it.recordId])
        .filter((it): it is EventDetails => it !== undefined)
        .orderBy((it) => it.StartDateTimeUtc, "asc")
        .value(),
);

export const selectEventsByRoom = createSelector([eventsSelector.selectAll, (_state, roomId: RecordId) => roomId], (events, roomId) =>
    events.filter((it) => it?.ConferenceRoomId === roomId),
);
export const selectEventsByTrack = createSelector([eventsSelector.selectAll, (_state, trackId: RecordId) => trackId], (events, trackId) =>
    events.filter((it) => it?.ConferenceTrackId === trackId),
);
export const selectEventsByDay = createSelector([eventsSelector.selectAll, (_state, dayId: RecordId) => dayId], (events, dayId) =>
    events.filter((it) => it?.ConferenceDayId === dayId),
);

export const selectDealersByDayName = createSelector([dealersSelectors.selectAll, (_state, day: AttendanceDay) => day], (dealers, day) =>
    dealers.filter((it) => {
        if (day === "mon") return it.AttendsOnThursday;
        if (day === "tue") return it.AttendsOnFriday;
        if (day === "wed") return it.AttendsOnSaturday;
        return false;
    }),
);
export const filterBrowsableMaps = <T extends Pick<MapDetails, "IsBrowseable">>(maps: T[]) => maps.filter((it) => it.IsBrowseable);
export const selectBrowsableMaps = createSelector(mapsSelectors.selectAll, (state) => filterBrowsableMaps(state));

export const selectValidLinksByTarget = createSelector(
    [mapsSelectors.selectAll, (_state, target: RecordId) => target],
    (maps, target): { map: MapDetails; entry: MapEntryRecord; link: LinkFragment }[] =>
        chain(maps)
            .flatMap((map) => map.Entries.map((entry) => ({ map, entry })))
            .flatMap(({ map, entry }) => entry.Links.map((link) => ({ map, entry, link })))
            .filter(({ link }) => target === link.Target)
            .value(),
);

/**
 * Selects all knowledge items in a sorted manner that is ready for a section list.
 */
export const selectKnowledgeItems = createSelector(
    [knowledgeGroupsSelectors.selectAll, knowledgeEntriesSelectors.selectAll],
    (groups, entries): (KnowledgeGroupRecord & { entries: KnowledgeEntryRecord[] })[] => {
        return _.chain(groups)
            .orderBy((it) => it.Order)
            .map((group) => ({
                ...group,
                entries: _.chain(entries)
                    .filter((entry) => entry.KnowledgeGroupId === group.Id)
                    .orderBy((it) => it.Order)
                    .value(),
            }))
            .value();
    },
);

export const selectKnowledgeItemsSections = createSelector(selectKnowledgeItems, (items): SectionListData<KnowledgeEntryRecord, KnowledgeGroupRecord>[] =>
    items.map((it) => ({
        ...it,
        data: it.entries,
    })),
);

export const selectIsSynchronized = createSelector(
    (state: RootState) => state.eurofurenceCache.state,
    (state) => state === "refreshing",
);

export const selectImagesById = createSelector([imagesSelectors.selectEntities, (_state, imageIds: RecordId[]) => imageIds], (images, imageIds): ImageDetails[] =>
    imageIds.map((it) => images[it]).filter((it): it is ImageDetails => it !== undefined),
);

// TODO: Verify selectors below.

// TODO: Not a fan of moment in selectors.
export const selectUpcomingFavoriteEvents = createSelector([selectFavoriteEvents, (_state, now: Moment) => now], (events, now) =>
    events.filter((it) => now.isSame(it.StartDateTimeUtc, "day")).filter((it) => now.isBefore(it.EndDateTimeUtc)),
);

export const filterCurrentEvents = <T extends Pick<EventDetails, "StartDateTimeUtc" | "EndDateTimeUtc">>(events: T[], now: Moment) =>
    events.filter((it) => now.isBetween(it.StartDateTimeUtc, it.EndDateTimeUtc));
export const selectCurrentEvents = createSelector([eventsSelector.selectAll, (_state, now: Moment) => now], (events, now) => filterCurrentEvents(events, now));

export const filterUpcomingEvents = <T extends Pick<EventDetails, "StartDateTimeUtc">>(events: T[], now: Moment) =>
    events.filter((it) => {
        const startMoment = moment(it.StartDateTimeUtc, true).subtract(30, "minutes");
        const endMoment = moment(it.StartDateTimeUtc, true);
        return now.isBetween(startMoment, endMoment);
    });
export const selectUpcomingEvents = createSelector([eventsSelector.selectAll, (_state, now: Moment) => now], (events, now) => filterUpcomingEvents(events, now));

export const filterActiveAnnouncements = <T extends Pick<AnnouncementDetails, "ValidUntilDateTimeUtc" | "ValidFromDateTimeUtc">>(announcements: T[], now: Moment) =>
    announcements.filter((it) => now.isBetween(it.ValidFromDateTimeUtc, it.ValidUntilDateTimeUtc, "minute"));
export const selectActiveAnnouncements = createSelector([announcementsSelectors.selectAll, (_state, now: Moment) => now], (announcements, now) =>
    filterActiveAnnouncements(announcements, now),
);
