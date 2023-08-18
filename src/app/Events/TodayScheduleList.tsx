import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { EventCard } from "./EventCard";
import { Section } from "../../components/Atoms/Section";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { selectUpcomingFavoriteEvents } from "../../store/eurofurence.selectors";
import { EventDetails } from "../../store/eurofurence.types";

export const TodayScheduleList = () => {
    const { t } = useTranslation("Events");

    const [now] = useNow();
    const navigation = useAppNavigation("Areas");
    const events = useAppSelector((state) => selectUpcomingFavoriteEvents(state, now));

    const onPress = useCallback(
        (event: EventDetails) =>
            navigation.navigate("Event", {
                id: event.Id,
            }),
        [navigation],
    );

    if (events.length === 0) {
        return null;
    }

    return (
        <>
            <Section title={t("today_schedule_title")} subtitle={t("today_schedule_subtitle")} icon={"book-marker"} />
            {events.map((event) => (
                <EventCard key={event.Id} event={event} type="time" onPress={onPress} />
            ))}
        </>
    );
};
