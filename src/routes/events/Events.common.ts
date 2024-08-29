import { TFunction } from "i18next";
import { Moment } from "moment/moment";
import { useMemo } from "react";

import { EventDetailsInstance, eventInstanceForAny, eventInstanceForNotPassed, eventInstanceForPassed } from "../../components/events/EventCard";
import { eventSectionForDate, eventSectionForHidden, eventSectionForPartOfDay, eventSectionForPassed, EventSectionProps } from "../../components/events/EventSection";
import { EventDetails } from "../../store/eurofurence/types";

/**
 Returns a list of event instances according to conversion rules.
 * @param t The translation function.
 * @param now The current moment.
 * @param items The items to transform.
 */
export const useEventInstances = (t: TFunction, now: Moment, items: EventDetails[]) => {
    // Return direct mapping.
    return useMemo(() => {
        return items.map((item) => eventInstanceForAny(item, now));
    }, [t, now, items]);
};

/**
 * Generates search result grouping with event detail instances prepared for
 * display standalone dates.
 * @param t The translation function.
 * @param now The current moment.
 * @param results Results for search if given.
 */
export const useEventSearchGroups = (t: TFunction, now: Moment, results: EventDetails[] | null) => {
    return useMemo(() => {
        if (!results) return [];

        let hidden = 0;

        // Search results are only split into upcoming and passed. This is
        // done in two passes.
        let sectionedPassed = false;

        const result: (EventSectionProps | EventDetailsInstance)[] = [];

        // Count hidden and append all by start time.
        for (const item of results) {
            if (item.Hidden) {
                hidden++;
            } else if (now.isBefore(item.EndDateTimeUtc)) {
                result.push(eventInstanceForAny(item, now));
            }
        }

        // Add hidden header.
        if (hidden > 0) {
            result.splice(0, 0, eventSectionForHidden(t, hidden));
        }

        // Second pass not hidden and passed.
        for (const item of results) {
            if (!item.Hidden && !now.isBefore(item.EndDateTimeUtc)) {
                if (!sectionedPassed) {
                    result.push(eventSectionForPassed(t));
                    sectionedPassed = true;
                }
                result.push(eventInstanceForPassed(item));
            }
        }

        return result;
    }, [t, now, results]);
};

/**
 * Generates event grouping with event detail instances prepared for
 * display dates with the context of the current day.
 * @param t The translation function.
 * @param now The current moment.
 * @param all The events on that day.
 */
export const useEventDayGroups = (t: TFunction, now: Moment, all: EventDetails[]) => {
    return useMemo(() => {
        let hidden = 0;

        // Sections are consecutive as event start time (which informs the
        // part of day) is the sort key. Section changes are therefore
        // consecutive as well. Passed events are collected in the second pass.
        let sectionedMorning = false;
        let sectionedAfternoon = false;
        let sectionedEvening = false;
        let sectionedNight = false;
        let sectionedPassed = false;

        const result: (EventSectionProps | EventDetailsInstance)[] = [];

        // Count hidden and append all by start time.
        for (const item of all) {
            if (item.Hidden) {
                hidden++;
            } else if (now.isBefore(item.EndDateTimeUtc)) {
                // First pass not passed.
                if (item.PartOfDay === "morning") {
                    if (!sectionedMorning) {
                        result.push(eventSectionForPartOfDay(t, "morning"));
                        sectionedMorning = true;
                    }

                    result.push(eventInstanceForNotPassed(item, now));
                } else if (item.PartOfDay === "afternoon") {
                    if (!sectionedAfternoon) {
                        result.push(eventSectionForPartOfDay(t, "afternoon"));
                        sectionedAfternoon = true;
                    }

                    result.push(eventInstanceForNotPassed(item, now));
                } else if (item.PartOfDay === "evening") {
                    if (!sectionedEvening) {
                        result.push(eventSectionForPartOfDay(t, "evening"));
                        sectionedEvening = true;
                    }

                    result.push(eventInstanceForNotPassed(item, now));
                } else if (item.PartOfDay === "night") {
                    if (!sectionedNight) {
                        result.push(eventSectionForPartOfDay(t, "night"));
                        sectionedNight = true;
                    }

                    result.push(eventInstanceForNotPassed(item, now));
                }
            }
        }

        // Add hidden header.
        if (hidden > 0) {
            result.splice(0, 0, eventSectionForHidden(t, hidden));
        }

        // Second pass not hidden and passed.
        for (const item of all) {
            if (!item.Hidden && !now.isBefore(item.EndDateTimeUtc)) {
                if (!sectionedPassed) {
                    result.push(eventSectionForPassed(t));
                    sectionedPassed = true;
                }
                result.push(eventInstanceForPassed(item));
            }
        }

        return result;
    }, [t, now, all]);
};

/**
 Generates event grouping with event detail instances prepared for
 display standalone dates.
 * @param t The translation function.
 * @param now The current moment.
 * @param all The events on that day.
 */
export const useEventOtherGroups = (t: TFunction, now: Moment, all: EventDetails[]) => {
    return useMemo(() => {
        let hidden = 0;

        // Days sections changes are consecutive, as the default sorting
        // for events is by time. Passed events are collected in the second
        // pass.
        const sectionedDays: Record<string, boolean> = {};
        let sectionedPassed = false;
        const result: (EventSectionProps | EventDetailsInstance)[] = [];

        // Count hidden and append all by start time.
        for (const item of all) {
            if (item.Hidden) {
                hidden++;
            } else if (!item.ConferenceDay) {
                // Nothing, not applicable.
            } else if (now.isBefore(item.EndDateTimeUtc)) {
                if (!(item.ConferenceDay.Date in sectionedDays)) {
                    result.push(eventSectionForDate(t, item.ConferenceDay.Date));
                    sectionedDays[item.ConferenceDay.Date] = true;
                }

                result.push(eventInstanceForNotPassed(item, now));
            }
        }

        // Add hidden header.
        if (hidden > 0) {
            result.splice(0, 0, eventSectionForHidden(t, hidden));
        }

        // Second pass not hidden and passed.
        for (const item of all) {
            if (!item.Hidden && !now.isBefore(item.EndDateTimeUtc)) {
                if (!sectionedPassed) {
                    result.push(eventSectionForPassed(t));
                    sectionedPassed = true;
                }
                result.push(eventInstanceForPassed(item));
            }
        }

        return result;
    }, [t, now, all]);
};
