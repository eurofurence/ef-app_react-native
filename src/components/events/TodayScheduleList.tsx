import { Moment } from "moment/moment";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { EventCard, eventInstanceForAny } from "./EventCard";
import { useAppNavigation } from "../../hooks/nav/useAppNavigation";
import { useAppSelector } from "../../store";
import { selectUpcomingFavoriteEvents } from "../../store/eurofurence.selectors";
import { Section } from "../generic/atoms/Section";

export type TodayScheduleListProps = {
    now: Moment;
};
export const TodayScheduleList: FC<TodayScheduleListProps> = ({ now }) => {
    const { t } = useTranslation("Events");

    const navigation = useAppNavigation("Areas");
    const eventsAll = useAppSelector((state) => selectUpcomingFavoriteEvents(state, now));
    const events = useMemo(() => eventsAll.map((details) => eventInstanceForAny(details, now)), [eventsAll, now]);

    if (eventsAll.length === 0) {
        return null;
    }

    return (
        <>
            <Section title={t("today_schedule_title")} subtitle={t("today_schedule_subtitle")} icon={"book-marker"} />
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
