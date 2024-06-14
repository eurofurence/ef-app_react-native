import { createSelector } from "@reduxjs/toolkit";
import { chain } from "lodash";
import moment, { Moment } from "moment/moment";

import { eventsSelector } from "./records";
import { RootState } from "../../index";
import { EventDetails, RecordId } from "../types";

/**
 * @deprecated Check favorite flag // TODO
 */
export const selectFavoriteEvents = createSelector([eventsSelector.selectEntities, (state: RootState) => state.background.notifications], (events, notifications): EventDetails[] =>
    chain(notifications)
        .filter((it) => it.type === "EventReminder")
        .map((it): EventDetails | undefined => events[it.recordId])
        .filter((it): it is EventDetails => it !== undefined)
        .orderBy((it) => it.StartDateTimeUtc, "asc")
        .value(),
);

const baseEventGroupSelector = createSelector([eventsSelector.selectAll], (items) => {
    const result: {
        room: Record<string, EventDetails[]>;
        track: Record<string, EventDetails[]>;
        day: Record<string, EventDetails[]>;
    } = {
        room: {},
        track: {},
        day: {},
    };

    for (const event of items) {
        if (event.ConferenceRoomId) (result.room[event.ConferenceRoomId] ??= []).push(event);
        if (event.ConferenceTrackId) (result.track[event.ConferenceTrackId] ??= []).push(event);
        if (event.ConferenceDayId) (result.day[event.ConferenceDayId] ??= []).push(event);
    }
    return result;
});

export const selectEventsByRoom = createSelector([baseEventGroupSelector, (_state, roomId: RecordId) => roomId], (events, roomId) => events.room[roomId] ?? []);
export const selectEventsByTrack = createSelector([baseEventGroupSelector, (_state, trackId: RecordId) => trackId], (events, trackId) => events.track[trackId] ?? []);
export const selectEventsByDay = createSelector([baseEventGroupSelector, (_state, dayId: RecordId) => dayId], (events, dayId) => events.day[dayId] ?? []);

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
