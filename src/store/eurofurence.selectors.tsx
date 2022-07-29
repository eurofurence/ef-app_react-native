import { createSelector, Dictionary } from "@reduxjs/toolkit";
import _, { chain } from "lodash";
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
    AttendanceDay,
    DealerRecord,
    EnrichedDealerRecord,
    EnrichedEventRecord,
    EnrichedImageRecord,
    EnrichedMapRecord,
    EventDayRecord,
    EventRecord,
    EventRoomRecord,
    EventTrackRecord,
    KnowledgeEntryRecord,
    KnowledgeGroupRecord,
    LinkFragment,
    MapEntryRecord,
    RecordId,
} from "./eurofurence.types";
import { RootState } from "./index";

// These selectors are basic and we can immediately export them
export const eventRoomsSelectors = eventRoomsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.eventRooms);
export const eventTracksSelectors = eventTracksAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.eventTracks);
export const knowledgeGroupsSelectors = knowledgeGroupsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.knowledgeGroups);
export const knowledgeEntriesSelectors = knowledgeEntriesAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.knowledgeEntries);
export const imagesSelectors = imagesAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.images);

// Save these selectors as we re-use them later
const baseEventDaysSelectors = eventDaysAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.eventDays);
const baseEventsSelector = eventsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.events);
const baseAnnouncementsSelectors = announcementsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.announcements);
const baseMapsSelectors = mapsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.maps);
const baseDealersSelectors = dealersAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.dealers);

export const eventDaysSelectors = {
    ...baseEventDaysSelectors,
    selectCountdownTitle: createSelector([baseEventDaysSelectors.selectAll, (days, now: Moment) => now], (days, now): string => {
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
            return `${conName} will start in ${diff}`;
        } else if (lastDay && now.isAfter(lastDay.Date, "day")) {
            return "That was it! We hope to see you again next year!";
        } else {
            return "";
        }
    }),
};
/**
 * An event with the external references as required.
 */
export type EventWithDetails = EnrichedEventRecord & {
    ConferenceRoom: EventRoomRecord;
    ConferenceDay: EventDayRecord;
    ConferenceTrack: EventTrackRecord;
};

const applyEventDetails = (rooms: Dictionary<EventRoomRecord>, tracks: Dictionary<EventTrackRecord>, days: Dictionary<EventDayRecord>) => (event: EventRecord) => {
    if (tracks[event.ConferenceTrackId ?? ""] === undefined || days[event.ConferenceDayId ?? ""] === undefined || rooms[event.ConferenceRoomId ?? ""] === undefined)
        return undefined;
    return {
        ...event,
        // Either we propagate undefined-ness in the type or we ignore.
        ConferenceRoom: rooms[event.ConferenceRoomId as any] as any,
        ConferenceDay: days[event.ConferenceDayId as any] as any,
        ConferenceTrack: tracks[event.ConferenceTrackId as any] as any,
    } as EventWithDetails;
};

const selectFavoriteEvents = createSelector([baseEventsSelector.selectAll, (state: RootState) => state.background.notifications], (events, notifications): EnrichedEventRecord[] =>
    _.chain(notifications)
        .filter((it) => it.type === "EventReminder")
        .map((it): EnrichedEventRecord | undefined => events.find((event) => event.Id === it.recordId))
        .filter((it): it is EnrichedEventRecord => it !== undefined)
        .orderBy((it) => it.StartDateTimeUtc, "asc")
        .value()
);

const selectUpcomingFavoriteEvents = createSelector([selectFavoriteEvents, (state, now: Moment) => now], (events, now) => events.filter((it) => now.isBefore(it.EndDateTimeUtc)));
export const eventsSelectors = {
    ...baseEventsSelector,
    selectByRoom: createSelector([baseEventsSelector.selectAll, (state, itemId: RecordId) => itemId], (events, itemId) => events.filter((it) => it?.ConferenceRoomId === itemId)),
    selectByTrack: createSelector([baseEventsSelector.selectAll, (state, itemId: RecordId) => itemId], (events, itemId) => events.filter((it) => it?.ConferenceTrackId === itemId)),
    selectByDay: createSelector([baseEventsSelector.selectAll, (state, itemId: RecordId) => itemId], (events, itemId) => events.filter((it) => it?.ConferenceDayId === itemId)),
    selectUpcomingEvents: createSelector([baseEventsSelector.selectAll, (events, now: Moment) => now], (events, now) =>
        events.filter((it) => {
            const startMoment = moment(it.StartDateTimeUtc);
            return now.isBetween(startMoment.subtract(30, "minutes"), startMoment);
        })
    ),
    selectCurrentEvents: createSelector([baseEventsSelector.selectAll, (events, now: Moment) => now], (events, now) =>
        events.filter((it) => {
            return now.isBetween(it.StartDateTimeUtc, it.EndDateTimeUtc);
        })
    ),
    selectFavorites: selectFavoriteEvents,
    selectUpcomingFavorites: selectUpcomingFavoriteEvents,
    selectEnrichedEvents: createSelector(
        [(state, events: EnrichedEventRecord[]) => events, eventDaysSelectors.selectEntities, eventTracksSelectors.selectEntities, eventRoomsSelectors.selectEntities],
        (events, days, tracks, rooms) => events.map(applyEventDetails(rooms, tracks, days)).filter((it): it is EventWithDetails => it !== undefined)
    ),
};

export const eventsCompleteSelectors = {
    ...baseEventsSelector,
    selectAll: createSelector(
        [baseEventsSelector.selectAll, eventDaysSelectors.selectEntities, eventTracksSelectors.selectEntities, eventRoomsSelectors.selectEntities],
        (events, days, tracks, rooms): EventWithDetails[] => events.map(applyEventDetails(rooms, tracks, days)).filter((it): it is EventWithDetails => it !== undefined)
    ),
    selectByRoom: createSelector(
        [
            baseEventsSelector.selectAll,
            eventDaysSelectors.selectEntities,
            eventTracksSelectors.selectEntities,
            eventRoomsSelectors.selectEntities,
            (state, itemId: RecordId) => itemId,
        ],
        (events, days, tracks, rooms, itemId) => events.filter((it) => it?.ConferenceRoomId === itemId).map(applyEventDetails(rooms, tracks, days))
    ),
    selectByTrack: createSelector(
        [
            baseEventsSelector.selectAll,
            eventDaysSelectors.selectEntities,
            eventTracksSelectors.selectEntities,
            eventRoomsSelectors.selectEntities,
            (state, itemId: RecordId) => itemId,
        ],
        (events, days, tracks, rooms, itemId) => events.filter((it) => it?.ConferenceTrackId === itemId).map(applyEventDetails(rooms, tracks, days))
    ),
    selectByDay: createSelector(
        [
            baseEventsSelector.selectAll,
            eventDaysSelectors.selectEntities,
            eventTracksSelectors.selectEntities,
            eventRoomsSelectors.selectEntities,
            (state, itemId: RecordId) => itemId,
        ],
        (events, days, tracks, rooms, itemId) => events.filter((it) => it?.ConferenceDayId === itemId).map(applyEventDetails(rooms, tracks, days))
    ),
    selectById: createSelector(
        [baseEventsSelector.selectById, eventDaysSelectors.selectEntities, eventTracksSelectors.selectEntities, eventRoomsSelectors.selectEntities],
        (event, days, tracks, rooms): EventWithDetails | undefined => (!event ? undefined : applyEventDetails(rooms, tracks, days)(event))
    ),
    selectUpcomingEvents: createSelector(
        [baseEventsSelector.selectAll, (state, now: Moment) => now, eventDaysSelectors.selectEntities, eventTracksSelectors.selectEntities, eventRoomsSelectors.selectEntities],
        (events, now, days, tracks, rooms) =>
            events
                .filter((it) => {
                    const startMoment = moment(it.StartDateTimeUtc, true);
                    return now.isBetween(startMoment.subtract(30, "minutes"), startMoment);
                })
                .map(applyEventDetails(rooms, tracks, days))
    ),
};

export const annoucenementsSelectors = {
    ...baseAnnouncementsSelectors,
    selectActiveAnnouncements: createSelector([baseAnnouncementsSelectors.selectAll, (state, now: Moment) => now], (announcements, now) =>
        announcements.filter((it) => now.isBetween(it.ValidFromDateTimeUtc, it.ValidUntilDateTimeUtc))
    ),
};

/**
 * An event with the external references as required.
 */
export type DealerWithDetails = EnrichedDealerRecord & {
    AttendanceDayNames: AttendanceDay[];
    AttendanceDays: EventDayRecord[];
};

const applyDealerDetails = (days: Dictionary<EventDayRecord>) => (dealer: DealerRecord) => {
    // Concatenated day names.
    const attendanceDayNames: AttendanceDay[] = [];
    if (dealer.AttendsOnThursday) attendanceDayNames.push("thu");
    if (dealer.AttendsOnFriday) attendanceDayNames.push("fri");
    if (dealer.AttendsOnSaturday) attendanceDayNames.push("sat");

    // Actual conference days.
    const attendanceDays: EventDayRecord[] = [];
    for (const day of Object.values(days)) {
        // Sun:0, Mon:1 , Tue:2, Wed:3, Thu:4, Fri:5, Sat:6.
        if (dealer.AttendsOnThursday && day && moment(day.Date).day() === 4) attendanceDays.push(day);
        if (dealer.AttendsOnFriday && day && moment(day.Date).day() === 5) attendanceDays.push(day);
        if (dealer.AttendsOnSaturday && day && moment(day.Date).day() === 6) attendanceDays.push(day);
    }

    return {
        ...dealer,
        AttendanceDayNames: attendanceDayNames,
        AttendanceDays: attendanceDays,
    } as DealerWithDetails;
};

export const dealersSelectors = baseDealersSelectors;

export const dealersCompleteSelectors = {
    ...baseDealersSelectors,
    selectAll: createSelector([baseDealersSelectors.selectAll, eventDaysSelectors.selectEntities], (dealers, days): DealerWithDetails[] => dealers.map(applyDealerDetails(days))),
    selectByDayName: createSelector([baseDealersSelectors.selectAll, eventDaysSelectors.selectEntities, (state, day: AttendanceDay) => day], (dealers, days, day) =>
        dealers
            .filter(
                (it) =>
                    // Check for thursday when given as "thu".
                    it.AttendsOnThursday === (day === "thu") ||
                    // Check for friday when given as "fri".
                    it.AttendsOnFriday === (day === "fri") ||
                    // Check for saturday when given as "sat".
                    it.AttendsOnSaturday === (day === "sat")
            )
            .map(applyDealerDetails(days))
    ),
    selectById: createSelector([baseDealersSelectors.selectById, eventDaysSelectors.selectEntities], (dealer, days): DealerWithDetails | undefined =>
        !dealer ? undefined : applyDealerDetails(days)(dealer)
    ),
};

/**
 * An event with the external references as required.
 */
export type MapWithDetails = EnrichedMapRecord & {
    Image: EnrichedImageRecord;
};

const applyMapDetails = (images: Dictionary<EnrichedImageRecord>) => (map: EnrichedMapRecord) => {
    return {
        ...map,
        Image: images[map.ImageId],
    } as MapWithDetails;
};

export const mapsSelectors = {
    ...baseMapsSelectors,
    selectBrowseableMaps: createSelector(baseMapsSelectors.selectAll, (maps): EnrichedMapRecord[] => maps.filter((it) => it.IsBrowseable)),

    selectValidLinksByTarget: createSelector(
        [baseMapsSelectors.selectAll, (state, target: RecordId) => target],
        (maps, target): { map: EnrichedMapRecord; entry: MapEntryRecord; link: LinkFragment }[] =>
            chain(maps)
                .flatMap((map) => map.Entries.map((entry) => ({ map, entry })))
                .flatMap(({ map, entry }) => entry.Links.map((link) => ({ map, entry, link })))
                .filter(({ link }) => target === link.Target)
                .value()
    ),
};

export const mapsCompleteSelectors = {
    ...baseMapsSelectors,
    selectAll: createSelector([baseMapsSelectors.selectAll, imagesSelectors.selectEntities], (maps, images): MapWithDetails[] => maps.map(applyMapDetails(images))),
    selectById: createSelector([baseMapsSelectors.selectById, imagesSelectors.selectEntities], (map, images): MapWithDetails | undefined =>
        !map ? undefined : applyMapDetails(images)(map)
    ),
    selectBrowseableMaps: createSelector([baseMapsSelectors.selectAll, imagesSelectors.selectEntities], (maps, images) =>
        maps.filter((it) => it.IsBrowseable).map(applyMapDetails(images))
    ),
    selectValidLinksByTarget: createSelector(
        [baseMapsSelectors.selectAll, imagesSelectors.selectEntities, (state, target: RecordId) => target],
        (maps, images, target): { map: MapWithDetails; entry: MapEntryRecord; link: LinkFragment }[] => {
            const applyDetails = applyMapDetails(images);
            const results = [];

            // Flat map via nested loops. This is easier to read and does not instantiate arrays in the flat map steps.
            for (const map of maps) {
                // Enumerate map's entries.
                for (const entry of map.Entries) {
                    // Enumerate entry's links.
                    for (const link of entry.Links) {
                        // Append if on target.
                        if (target === link.Target) results.push({ map: applyDetails(map), entry, link });
                    }
                }
            }

            return results;
        }
    ),
};

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

export const selectImagesById = createSelector([imagesSelectors.selectEntities, (state, imageIds: RecordId[]) => imageIds], (images, imageIds): EnrichedImageRecord[] =>
    imageIds.map((it) => images[it]).filter((it): it is EnrichedImageRecord => it !== undefined)
);
