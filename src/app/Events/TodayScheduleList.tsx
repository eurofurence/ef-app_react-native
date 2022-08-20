import { useTranslation } from "react-i18next";

import { Section } from "../../components/Atoms/Section";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { selectUpcomingFavoriteEvents } from "../../store/eurofurence.selectors";
import { EventCard } from "./EventCard";

export const TodayScheduleList = () => {
    const { t } = useTranslation("Events");

    const [now] = useNow();
    const navigation = useAppNavigation("Areas");
    const events = useAppSelector((state) => selectUpcomingFavoriteEvents(state, now));

    if (events.length === 0) {
        return null;
    }

    return (
        <>
            <Section title={t("today_schedule_title")} subtitle={t("today_schedule_subtitle")} icon={"book-marker"} />
            {events.map((event) => (
                <EventCard
                    key={event.Id}
                    event={event}
                    type={"time"}
                    onPress={() =>
                        navigation.navigate("Event", {
                            id: event.Id,
                        })
                    }
                />
            ))}
        </>
    );
};
