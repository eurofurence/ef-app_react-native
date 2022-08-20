import { createSelector } from "@reduxjs/toolkit";
import { EntityId, EntitySelectors } from "@reduxjs/toolkit/src/entities/models";
import { TFunction } from "i18next";
import _, { chain, Dictionary as LodashDictionary, map, mapValues } from "lodash";
import moment, { Moment } from "moment";
import { SectionListData } from "react-native";

import { conName } from "../configuration";
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
import {
    applyAnnouncementDetails,
    applyDealerDetails,
    applyEventDayDetails,
    applyEventDetails,
    applyEventRoomDetails,
    applyEventTrackDetails,
    applyImageDetails,
    applyKnowledgeEntryDetails,
    applyKnowledgeGroupDetails,
    applyMapDetails,
} from "./eurofurence.details";
import {
    AttendanceDay,
    EventDayRecord,
    EventDetails,
    ImageDetails,
    KnowledgeEntryRecord,
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

/**
 * Creates a new set of selectors from the passed entity selectors and the given apply function.
 * @param from The source selectors.
 * @param transform The transform function.
 */
const transformEntitySelector = <T, TResult>(from: EntitySelectors<T, RootState>, transform: (state: RootState, source: T) => TResult): RecordSelectors<TResult> => {
    // Returns a bound transformation function.
    const selectBound = (state: RootState) => (item: T) => transform(state, item);

    // Redefined selectors.
    const selectTotal = from.selectTotal;
    const selectIds = createSelector([from.selectIds], (ids) => ids.filter((id: EntityId): id is RecordId => typeof id === "string"));
    const selectEntities = createSelector([from.selectEntities, selectBound], (entities, bound) => mapValues(entities as LodashDictionary<T>, bound));
    const selectAll = createSelector([from.selectAll, selectBound], (all, bound) => map(all, bound));
    const selectById = createSelector([from.selectById, selectBound], (item, bound) => (item === undefined ? undefined : bound(item)));

    // Returns combined object of them all.
    return {
        selectTotal,
        selectIds,
        selectEntities,
        selectAll,
        selectById,
    };
};

export const eventRoomsSelectors = transformEntitySelector(
    eventRoomsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.eventRooms),
    applyEventRoomDetails
);
export const eventTracksSelectors = transformEntitySelector(
    eventTracksAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.eventTracks),
    applyEventTrackDetails
);
export const knowledgeGroupsSelectors = transformEntitySelector(
    knowledgeGroupsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.knowledgeGroups),
    applyKnowledgeGroupDetails
);
export const knowledgeEntriesSelectors = transformEntitySelector(
    knowledgeEntriesAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.knowledgeEntries),
    applyKnowledgeEntryDetails
);
export const imagesSelectors = transformEntitySelector(
    imagesAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.images),
    applyImageDetails
);
export const eventDaysSelectors = transformEntitySelector(
    eventDaysAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.eventDays),
    applyEventDayDetails
);
export const eventsSelector = transformEntitySelector(
    eventsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.events),
    applyEventDetails
);
export const announcementsSelectors = transformEntitySelector(
    announcementsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.announcements),
    applyAnnouncementDetails
);
export const mapsSelectors = transformEntitySelector(
    mapsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.maps),
    applyMapDetails
);
export const dealersSelectors = transformEntitySelector(
    dealersAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.dealers),
    applyDealerDetails
);

export const selectCountdownTitle = createSelector([eventDaysSelectors.selectAll, (days, now: Moment) => now, (days, now: Moment, t: TFunction) => t], (days, now, t): string => {
    const firstDay: EventDayRecord | undefined = _.chain(days)
        .orderBy((it) => it.Date, "asc")
        .first()
        .value();
    const lastDay: EventDayRecord | undefined = _.chain(days)
        .orderBy((it) => it.Date, "desc")
        .last()
        .value();
    const currentDay: EventDayRecord | undefined = days.find((it) => now.isSame(it.Date, "day"));

    if (currentDay) {
        return currentDay.Name;
    } else if (firstDay && now.isBefore(firstDay.Date, "day")) {
        const diff = moment.duration(now.diff(firstDay.Date)).humanize();
        return t("before_event", { conName, diff });
    } else if (lastDay && now.isAfter(lastDay.Date, "day")) {
        return t("after_event");
    } else {
        return "";
    }
});

export const selectFavoriteEvents = createSelector([eventsSelector.selectAll, (state: RootState) => state.background.notifications], (events, notifications): EventDetails[] =>
    _.chain(notifications)
        .filter((it) => it.type === "EventReminder")
        .map((it): EventDetails | undefined => events.find((event) => event.Id === it.recordId))
        .filter((it): it is EventDetails => it !== undefined)
        .orderBy((it) => it.StartDateTimeUtc, "asc")
        .value()
);

export const selectUpcomingFavoriteEvents = createSelector([selectFavoriteEvents, (state, now: Moment) => now], (events, now) =>
    events.filter((it) => now.isSame(it.StartDateTimeUtc, "day")).filter((it) => now.isBefore(it.EndDateTimeUtc))
);

export const selectCurrentEvents = createSelector([eventsSelector.selectAll, (events, now: Moment) => now], (events, now) =>
    events.filter((it) => {
        return now.isBetween(it.StartDateTimeUtc, it.EndDateTimeUtc);
    })
);

export const selectEventsByRoom = createSelector(
    [eventsSelector.selectAll, eventDaysSelectors.selectEntities, eventTracksSelectors.selectEntities, eventRoomsSelectors.selectEntities, (state, itemId: RecordId) => itemId],
    (events, days, tracks, rooms, itemId) => events.filter((it) => it?.ConferenceRoomId === itemId)
);
export const selectEventsByTrack = createSelector(
    [eventsSelector.selectAll, eventDaysSelectors.selectEntities, eventTracksSelectors.selectEntities, eventRoomsSelectors.selectEntities, (state, itemId: RecordId) => itemId],
    (events, days, tracks, rooms, itemId) => events.filter((it) => it?.ConferenceTrackId === itemId)
);
export const selectEventsByDay = createSelector(
    [eventsSelector.selectAll, eventDaysSelectors.selectEntities, eventTracksSelectors.selectEntities, eventRoomsSelectors.selectEntities, (state, itemId: RecordId) => itemId],
    (events, days, tracks, rooms, itemId) => events.filter((it) => it?.ConferenceDayId === itemId)
);

export const selectUpcomingEvents = createSelector([eventsSelector.selectAll, (state, now: Moment) => now], (events, now) =>
    events.filter((it) => {
        const startMoment = moment(it.StartDateTimeUtc, true).subtract(30, "minutes");
        const endMoment = moment(it.StartDateTimeUtc, true);
        return now.isBetween(startMoment, endMoment);
    })
);

export const selectActiveAnnouncements = createSelector([announcementsSelectors.selectAll, (state, now: Moment) => now], (announcements, now) =>
    announcements.filter((it) => now.isBetween(it.ValidFromDateTimeUtc, it.ValidUntilDateTimeUtc))
);

export const selectDealersByDayName = createSelector([dealersSelectors.selectAll, eventDaysSelectors.selectEntities, (state, day: AttendanceDay) => day], (dealers, days, day) =>
    dealers.filter((it) => {
        if (day === "thu") return it.AttendsOnThursday;
        if (day === "fri") return it.AttendsOnFriday;
        if (day === "sat") return it.AttendsOnSaturday;
        return false;
    })
);

export const selectBrowseableMaps = createSelector(mapsSelectors.selectAll, (maps): MapDetails[] => maps.filter((it) => it.IsBrowseable));

export const selectValidLinksByTarget = createSelector(
    [mapsSelectors.selectAll, (state, target: RecordId) => target],
    (maps, target): { map: MapDetails; entry: MapEntryRecord; link: LinkFragment }[] =>
        chain(maps)
            .flatMap((map) => map.Entries.map((entry) => ({ map, entry })))
            .flatMap(({ map, entry }) => entry.Links.map((link) => ({ map, entry, link })))
            .filter(({ link }) => target === link.Target)
            .value()
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
    }
);

export const selectKnowledgeItemsSections = createSelector(selectKnowledgeItems, (items): SectionListData<KnowledgeEntryRecord, KnowledgeGroupRecord>[] =>
    items.map((it) => ({
        ...it,
        data: it.entries,
    }))
);

export const selectIsSynchronized = createSelector(
    (state: RootState) => state.eurofurenceCache.state,
    (state) => state === "refreshing"
);

export const selectImagesById = createSelector([imagesSelectors.selectEntities, (state, imageIds: RecordId[]) => imageIds], (images, imageIds): ImageDetails[] =>
    imageIds.map((it) => images[it]).filter((it): it is ImageDetails => it !== undefined)
);
