import { isSameDay, isBefore, isWithinInterval, subMinutes } from "date-fns";
import { EventDetails, RecordId } from "../types";

// Replace Redux selectors with plain functions that operate on an array of events.

export const selectFavoriteEvents = (events: EventDetails[]): EventDetails[] => events.filter((event) => event.Favorite);

export const baseEventGroup = (events: EventDetails[]) => {
    const result: {
        room: Record<string, EventDetails[]>;
        track: Record<string, EventDetails[]>;
        day: Record<string, EventDetails[]>;
    } = {
        room: {},
        track: {},
        day: {},
    };

    for (const event of events) {
        if (event.ConferenceRoomId) (result.room[event.ConferenceRoomId] ??= []).push(event);
        if (event.ConferenceTrackId) (result.track[event.ConferenceTrackId] ??= []).push(event);
        if (event.ConferenceDayId) (result.day[event.ConferenceDayId] ??= []).push(event);
    }
    return result;
};

export const selectEventsByRoom = (events: EventDetails[], roomId: RecordId): EventDetails[] => {
    const groups = baseEventGroup(events);
    return groups.room[roomId] ?? [];
};

export const selectEventsByTrack = (events: EventDetails[], trackId: RecordId): EventDetails[] => {
    const groups = baseEventGroup(events);
    return groups.track[trackId] ?? [];
};

export const selectEventsByDay = (events: EventDetails[], dayId: RecordId): EventDetails[] => {
    const groups = baseEventGroup(events);
    return groups.day[dayId] ?? [];
};

export const filterHappeningTodayEvents = <T extends Pick<EventDetails, "StartDateTimeUtc" | "EndDateTimeUtc">>(events: T[], now: Date): T[] =>
    events.filter((it) => isSameDay(now, new Date(it.StartDateTimeUtc))).filter((it) => isBefore(now, new Date(it.EndDateTimeUtc)));

export const filterCurrentEvents = <T extends Pick<EventDetails, "StartDateTimeUtc" | "EndDateTimeUtc">>(events: T[], now: Date): T[] =>
    events.filter((it) =>
        isWithinInterval(now, {
            start: new Date(it.StartDateTimeUtc),
            end: new Date(it.EndDateTimeUtc),
        }),
    );

export const filterUpcomingEvents = <T extends Pick<EventDetails, "StartDateTimeUtc">>(events: T[], now: Date): T[] =>
    events.filter((it) => {
        const startDate = new Date(it.StartDateTimeUtc);
        const startMinus30 = subMinutes(startDate, 30);
        return isWithinInterval(now, { start: startMinus30, end: startDate });
    });

export const selectUpdatedFavoriteEvents = (favorites: EventDetails[], lastViewTimesUtc?: Record<string, string>): EventDetails[] => {
    if (!lastViewTimesUtc) return favorites;
    return favorites.filter((event) => event.Id in lastViewTimesUtc && new Date(event.LastChangeDateTimeUtc) > new Date(lastViewTimesUtc[event.Id]));
};
