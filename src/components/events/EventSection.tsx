import { TFunction } from "i18next";
import { FC } from "react";
import { PartOfDay } from "../../store/eurofurence/types";
import { IconNames } from "../generic/atoms/Icon";
import { Section, SectionProps } from "../generic/atoms/Section";
import { formatWeekdayInConventionTimezone } from "../../util/eventTiming";

export type EventSectionProps = SectionProps;

/**
 * Creates the properties for a "part of day" section.
 * @param t Translation function.
 * @param partOfDay Part of day.
 */
export function eventSectionForPartOfDay(t: TFunction, partOfDay: PartOfDay): EventSectionProps {
    return {
        title: t(partOfDay as PartOfDay),
        icon: ((partOfDay === "morning" && "weather-sunset-up") ||
            (partOfDay === "afternoon" && "weather-sunny") ||
            (partOfDay === "evening" && "weather-sunset-down") ||
            (partOfDay === "night" && "weather-night") ||
            (partOfDay === "long_running" && "calendar-range") ||
            "weather-sunny") as IconNames,
    };
}

/**
 * Creates the properties for a "hidden" section.
 * @param t Translation function.
 * @param count Number of events.
 */
export function eventSectionForHidden(t: TFunction, count: number): EventSectionProps {
    return {
        title: t("events_hidden"),
        icon: "eye-off" as IconNames,
        subtitle: t("events_hidden_subtitle", { count }),
    };
}

/**
 * Creates the properties for a "passed" section.
 * @param t Translation function.
 */
export function eventSectionForPassed(t: TFunction): EventSectionProps {
    return {
        title: t("events_done"),
        icon: "calendar-clock-outline" as IconNames,
    };
}

/**
 * Creates the properties for a generic "on this day" section.
 * @param t Translation function.
 * @param date Date of the event, in con time zone.
 */
export function eventSectionForDate(t: TFunction, date: string): EventSectionProps {
    return {
        title: formatWeekdayInConventionTimezone(date),
        icon: "calendar-outline" as IconNames,
    };
}

export const EventSection: FC<EventSectionProps> = ({ style, title, subtitle, icon }) => {
    return <Section style={style} title={title} subtitle={subtitle} backgroundColor="surface" icon={icon} />;
};
