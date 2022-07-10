import { createSelector } from "@reduxjs/toolkit";
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
import { RecordId } from "./eurofurence.types";
import { RootState } from "./index";

const baseEventsSelector = eventsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.events);
export const eventsSelector = {
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
    selectFavorites: createSelector([baseEventsSelector.selectAll, (state: RootState) => state.notifications.notifications], (events, notifications) =>
        notifications
            .filter((it) => it.type === "EventReminder")
            .map((it) => events.find((event) => event.Id === it.recordId))
            .filter((it) => it !== undefined)
    ),
};
export const eventDaysSelectors = eventDaysAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.eventDays);
export const eventRoomsSelectors = eventRoomsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.eventRooms);
export const eventTracksSelectors = eventTracksAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.eventTracks);
export const knowledgeGroupsSelectors = knowledgeGroupsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.knowledgeGroups);
export const knowledgeEntriesSelectors = knowledgeEntriesAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.knowledgeEntries);
export const imagesSelectors = imagesAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.images);
export const dealersSelectors = dealersAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.dealers);
const baseAnnouncementsSelectors = announcementsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.announcements);
export const annoucenementsSelectors = {
    ...baseAnnouncementsSelectors,
    selectActiveAnnouncements: createSelector([baseAnnouncementsSelectors.selectAll, (state, now: Moment) => now], (announcements, now) =>
        announcements.filter((it) => now.isBetween(it.ValidFromDateTimeUtc, it.ValidUntilDateTimeUtc))
    ),
};
const baseMapsSelectors = mapsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.maps);
export const mapsSelectors = {
    ...baseMapsSelectors,
    selectBrowseableMaps: createSelector(baseMapsSelectors.selectAll, (maps) => maps.filter((it) => it.IsBrowseable)),
};
