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
 */
export function eventSectionForPartOfDay(t: TFunction, partOfDay: PartOfDay): EventSectionProps {
    return {
        title: t(partOfDay as PartOfDay),
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
 * @param date Date of the event.
 */
export function eventSectionForDate(t: TFunction, date: string): EventSectionProps {
    return {
        title: moment(date).format("dddd"),
        icon: "calendar-outline" as IconNames,
    };
}

export const EventSection: FC<EventSectionProps> = ({ style, title, subtitle, icon }) => {
    return <Section style={style} title={title} subtitle={subtitle} backgroundColor="surface" icon={icon} />;
};
