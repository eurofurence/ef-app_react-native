import { Moment } from "moment/moment";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { EventCard, eventInstanceForAny } from "./EventCard";
import { useAppNavigation } from "../../hooks/nav/useAppNavigation";
import { useAppSelector } from "../../store";
import { filterHappeningTodayEvents, selectFavoriteEvents } from "../../store/eurofurence/selectors/events";
import { Section } from "../generic/atoms/Section";

export type TodayScheduleListProps = {
    now: Moment;
};
export const TodayScheduleList: FC<TodayScheduleListProps> = ({ now }) => {
    const { t } = useTranslation("Events");

    const navigation = useAppNavigation("Areas");
    const favorites = useAppSelector(selectFavoriteEvents);
    const events = useMemo(
        () =>
            filterHappeningTodayEvents(favorites, now)
                .filter((item) => !item.Hidden)
                .map((details) => eventInstanceForAny(details, now)),
        [favorites, now],
    );

    if (events.length === 0) {
        return null;
    }

    return (
        <>
            <Section title={t("today_schedule_title")} subtitle={t("today_schedule_subtitle")} icon="book-marker" />
            {events.map((event) => (
                <EventCard
                    key={event.details.Id}
                    event={event}
                    type="time"
                    onPress={(event) =>
                        navigation.navigate("Event", {
                            id: event.Id,
                        })
                    }
                />
            ))}
        </>
    );
};
