import { TFunction } from "i18next";
import moment from "moment/moment";
import { FC } from "react";

import { PartOfDay } from "../../store/eurofurence.types";
import { IconNames } from "../generic/atoms/Icon";
import { Section, SectionProps } from "../generic/atoms/Section";

export type EventSectionProps = SectionProps;

/**
 * Creates the properties for a "part of day" section.
 * @param t Translation function.
 * @param partOfDay Part of day.
 * @param eventsCount Number of events in this section.
 */
export function eventSectionForPartOfDay(t: TFunction, partOfDay: PartOfDay, eventsCount: number): EventSectionProps {
    return {
        title: t(partOfDay as PartOfDay),
        subtitle: t("events_count", { count: eventsCount }),
        icon: ((partOfDay === "morning" && "weather-sunset-up") ||
            (partOfDay === "afternoon" && "weather-sunny") ||
            (partOfDay === "evening" && "weather-sunset-down") ||
            (partOfDay === "night" && "weather-night") ||
            "weather-sunny") as IconNames,
    };
}

/**
 * Creates the properties for a "passed" section.
 * @param t Translation function.
 * @param passedCount Number of events in this section.
 */
export function eventSectionForPassed(t: TFunction, passedCount: number): EventSectionProps {
    return {
        title: t("events_done"),
        subtitle: t("events_count", { count: passedCount }),
        icon: "calendar-clock-outline" as IconNames,
    };
}

/**
 * Creates the properties for a generic "on this day" section.
 * @param t Translation function.
 * @param eventsCount Number of events in this section.
 */
export function eventSectionForDate(t: TFunction, date: string, eventsCount: number): EventSectionProps {
    return {
        title: moment(date).format("dddd"),
        subtitle: t("events_count", { count: eventsCount }),
        icon: "calendar-outline" as IconNames,
    };
}

export const EventSection: FC<EventSectionProps> = ({ title, subtitle, icon }) => {
    return <Section title={title} subtitle={subtitle} icon={icon} />;
};
