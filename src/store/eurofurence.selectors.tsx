import { createSelector, Dictionary } from "@reduxjs/toolkit";
import { chain } from "lodash";
import moment, { Moment } from "moment";

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
    EnrichedEventRoomRecord,
    EnrichedImageRecord,
    EnrichedMapRecord,
    EventDayRecord,
    EventRecord,
    EventRoomRecord,
    EventTrackRecord,
    LinkFragment,
    MapEntryRecord,
    RecordId,
} from "./eurofurence.types";
import { RootState } from "./index";

// These selectors are basic and we can immediately export them
export const eventDaysSelectors = eventDaysAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.eventDays);
export const eventRoomsSelectors = eventRoomsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.eventRooms);
export const eventTracksSelectors = eventTracksAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.eventTracks);
export const knowledgeGroupsSelectors = knowledgeGroupsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.knowledgeGroups);
export const knowledgeEntriesSelectors = knowledgeEntriesAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.knowledgeEntries);
export const imagesSelectors = imagesAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.images);

// Save these selectors as we re-use them later
const baseEventsSelector = eventsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.events);
const baseAnnouncementsSelectors = announcementsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.announcements);
const baseMapsSelectors = mapsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.maps);
const baseDealersSelectors = dealersAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.dealers);

/**
 * An event with the external references as required.
 */
export type EventWithDetails = EnrichedEventRecord & {
    ConferenceRoom: EnrichedEventRoomRecord;
    ConferenceDay: EventDayRecord;
    ConferenceTrack: EventTrackRecord;
};

const applyEventDetails = (rooms: Dictionary<EventRoomRecord>, tracks: Dictionary<EventTrackRecord>, days: Dictionary<EventDayRecord>) => (event: EventRecord) => {
    return {
        ...event,
        // Either we propagate undefined-ness in the type or we ignore.
        ConferenceRoom: rooms[event.ConferenceRoomId as any] as any,
        ConferenceDay: days[event.ConferenceDayId as any] as any,
        ConferenceTrack: tracks[event.ConferenceTrackId as any] as any,
    } as EventWithDetails;
};

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
    selectFavorites: createSelector([baseEventsSelector.selectAll, (state: RootState) => state.background.notifications], (events, notifications) =>
        notifications
            .filter((it) => it.type === "EventReminder")
            .map((it) => events.find((event) => event.Id === it.recordId))
            .filter((it) => it !== undefined)
    ),
};

export const eventsCompleteSelectors = {
    ...baseEventsSelector,
    selectAll: createSelector(
        [baseEventsSelector.selectAll, eventDaysSelectors.selectEntities, eventTracksSelectors.selectEntities, eventRoomsSelectors.selectEntities],
        (events, days, tracks, rooms): EventWithDetails[] => events.map(applyEventDetails(rooms, tracks, days))
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
    selectBrowseableMaps: createSelector(baseMapsSelectors.selectAll, (maps) => maps.filter((it) => it.IsBrowseable)),

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
