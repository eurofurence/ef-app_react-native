import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { EventCard } from "./EventCard";
import { Section } from "../../components/Atoms/Section";
import { useAppNavigation } from "../../hooks/navigation/useAppNavigation";
import { useNow } from "../../hooks/time/useNow";
import { useAppSelector } from "../../store";
import { selectUpcomingEvents } from "../../store/eurofurence.selectors";
import { EventDetails } from "../../store/eurofurence.types";

export const UpcomingEventsList = () => {
    const { t } = useTranslation("Events");

    const navigation = useAppNavigation("Areas");
    const [now] = useNow();
    const events = useAppSelector((state) => selectUpcomingEvents(state, now));

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
            <Section title={t("upcoming_title")} subtitle={t("upcoming_subtitle")} icon={"clock"} />
            {events.map((event) => (
                <EventCard key={event.Id} event={event} type="time" onPress={onPress} />
            ))}
        </>
    );
};
