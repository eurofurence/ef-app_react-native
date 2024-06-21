import { Moment } from "moment/moment";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { EventCard, eventInstanceForAny } from "./EventCard";
import { useAppNavigation } from "../../hooks/nav/useAppNavigation";
import { useAppSelector } from "../../store";
import { selectUpcomingEvents } from "../../store/eurofurence/selectors/events";
import { Section } from "../generic/atoms/Section";

export type UpcomingEventsListProps = {
    now: Moment;
};
export const UpcomingEventsList: FC<UpcomingEventsListProps> = ({ now }) => {
    const navigation = useAppNavigation("Areas");

    const { t } = useTranslation("Events");

    const eventsAll = useAppSelector((state) => selectUpcomingEvents(state, now));
    const events = useMemo(() => eventsAll.filter((item) => !item.Hidden).map((details) => eventInstanceForAny(details, now)), [eventsAll, now]);

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
