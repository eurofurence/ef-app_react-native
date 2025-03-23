import { differenceInMilliseconds, formatDuration, parseISO } from "date-fns";
import { format, toZonedTime } from "date-fns-tz";
import { EventDetails } from "../store/eurofurence/types";
import { conTimeZone } from "../configuration";

export function calculateEventTiming(details: EventDetails, now: Date | "done") {
    // Parse dates
    const eventStart = parseISO(details.StartDateTimeUtc);
    const eventEnd = parseISO(details.EndDateTimeUtc);
    
    // Calculate progress
    const progress = now !== "done" 
        ? differenceInMilliseconds(now, eventStart) / differenceInMilliseconds(eventEnd, eventStart)
        : 1.1;

    // Convert to con timezone
    const eventStartCon = toZonedTime(eventStart, conTimeZone);
    const start = format(eventStartCon, "p", { timeZone: conTimeZone }); // Local time format
    const day = format(eventStartCon, "EEE", { timeZone: conTimeZone }); // Day abbreviation

    // Convert to local timezone
    const eventStartLocal = new Date(eventStart);
    const startLocal = format(eventStartLocal, "p");
    const dayLocal = format(eventStartLocal, "EEE");

    // Calculate duration
    const durationMs = differenceInMilliseconds(eventEnd, eventStart);
    const durationHours = durationMs / (1000 * 60 * 60);
    const durationMinutes = durationMs / (1000 * 60);
    const runtime = durationHours >= 1 
        ? `${Math.floor(durationHours)}h` 
        : `${Math.floor(durationMinutes)}m`;

    return {
        progress,
        start,
        day,
        startLocal,
        dayLocal,
        runtime,
    };
}

/**
 * Format a date string to show the full weekday name in the convention timezone
 * @param dateStr The date string to format
 * @returns The formatted weekday name
 */
export function formatWeekdayInConventionTimezone(dateStr: string): string {
    const date = parseISO(dateStr);
    const zonedDate = toZonedTime(date, conTimeZone);
    return format(zonedDate, "EEEE", { timeZone: conTimeZone });
} 