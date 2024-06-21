import { TFunction } from "i18next";
import { chain, partition, sortBy } from "lodash";
import { Moment } from "moment/moment";
import { useMemo } from "react";

import { EventDetailsInstance, eventInstanceForAny, eventInstanceForNotPassed, eventInstanceForPassed } from "../../components/events/EventCard";
import { eventSectionForDate, eventSectionForHidden, eventSectionForPartOfDay, eventSectionForPassed, EventSectionProps } from "../../components/events/EventSection";
import { EventDetails, PartOfDay } from "../../store/eurofurence/types";

/**
 * Generates search result grouping with event detail instances prepared for
 * display standalone dates.
 * @param t The translation function.
 * @param now The current moment.
 * @param results Results for search if given.
 */
export const useEventSearchGroups = (t: TFunction, now: Moment, results: EventDetails[] | null) => {
    return useMemo(() => {
        // No sorting, score is included in sort.
        const [shown, hidden] = partition(results ?? [], (item) => !item.Hidden);
        const [upcoming, passed] = partition(shown, (item) => now.isBefore(item.EndDateTimeUtc));
        return chain(upcoming)
            .map((details) => eventInstanceForAny(details, now) as EventDetailsInstance | EventSectionProps)
            .thru((current) =>
                passed.length === 0
                    ? current
                    : current.concat([
                          // Passed header.
                          eventSectionForPassed(t),
                          // Passed event instances.
                          ...passed.map((details) => eventInstanceForPassed(details)),
                      ]),
            )
            .thru((current) =>
                hidden.length === 0
                    ? current
                    : [
                          // Hidden marker
                          eventSectionForHidden(t, hidden.length),
                          // Original elements.
                          ...current,
                      ],
            )
            .value();
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
        const [shown, hidden] = partition(all, (item) => !item.Hidden);
        const [upcoming, passed] = partition(shown, (item) => now.isBefore(item.EndDateTimeUtc));
        return chain(upcoming)
            .orderBy("StartDateTimeUtc")
            .groupBy("PartOfDay")
            .flatMap((events, partOfDay) => [
                // Header.
                eventSectionForPartOfDay(t, partOfDay as PartOfDay),
                // Event instances.
                ...events.map((details) => eventInstanceForNotPassed(details, now)),
            ])
            .thru((current) =>
                hidden.length === 0
                    ? current
                    : [
                          // Hidden marker
                          eventSectionForHidden(t, hidden.length),
                          // Original elements.
                          ...current,
                      ],
            )
            .thru((current) =>
                passed.length === 0
                    ? current
                    : [
                          // Original elements.
                          ...current,
                          // Passed header.
                          eventSectionForPassed(t),
                          // Passed event instances.
                          ...sortBy(passed, "StartDateTimeUtc").map((details) => eventInstanceForPassed(details)),
                      ],
            )
            .value();
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
        const [shown, hidden] = partition(all, (item) => !item.Hidden);
        const [upcoming, passed] = partition(shown, (item) => now.isBefore(item.EndDateTimeUtc));
        return chain(upcoming)
            .orderBy("StartDateTimeUtc")
            .groupBy((event) => event.ConferenceDay?.Date)
            .flatMap((events, date) => [
                // Header.
                eventSectionForDate(t, date),
                // Event instances.
                ...events.map((details) => eventInstanceForNotPassed(details, now)),
            ])
            .thru((current) =>
                hidden.length === 0
                    ? current
                    : [
                          // Hidden marker
                          eventSectionForHidden(t, hidden.length),
                          // Original elements.
                          ...current,
                      ],
            )
            .thru((current) =>
                passed.length === 0
                    ? current
                    : [
                          // Original elements.
                          ...current,
                          // Passed header.
                          eventSectionForPassed(t),
                          // Passed event instances.
                          ...sortBy(passed, "StartDateTimeUtc").map((details) => eventInstanceForPassed(details)),
                      ],
            )
            .value();
    }, [t, now, all]);
};
