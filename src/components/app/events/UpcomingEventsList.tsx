import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { EventCard, eventInstanceForAny } from "./EventCard";
import { useAppNavigation } from "../../../hooks/nav/useAppNavigation";
import { useNow } from "../../../hooks/time/useNow";
import { useAppSelector } from "../../../store";
import { selectUpcomingEvents } from "../../../store/eurofurence.selectors";
import { Section } from "../../generic/atoms/Section";

export const UpcomingEventsList = () => {
    const navigation = useAppNavigation("Areas");

    const { t } = useTranslation("Events");
    const [now] = useNow();

    const eventsAll = useAppSelector((state) => selectUpcomingEvents(state, now));
    const events = useMemo(() => eventsAll.map((details) => eventInstanceForAny(details, now)), [eventsAll, now]);

    if (events.length === 0) {
        return null;
    }

    return (
        <>
            <Section title={t("upcoming_title")} subtitle={t("upcoming_subtitle")} icon={"clock"} />
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
