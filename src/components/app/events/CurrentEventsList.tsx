import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import { EventCard, eventInstanceForAny } from "./EventCard";
import { useAppNavigation } from "../../../hooks/nav/useAppNavigation";
import { useNow } from "../../../hooks/time/useNow";
import { useAppSelector } from "../../../store";
import { selectCurrentEvents } from "../../../store/eurofurence.selectors";
import { Section } from "../../generic/atoms/Section";

export const CurrentEventList = () => {
    const { t } = useTranslation("Events");

    const navigation = useAppNavigation("Areas");
    const [now] = useNow();
    const eventsAll = useAppSelector((state) => selectCurrentEvents(state, now));
    const events = useMemo(() => eventsAll.map((details) => eventInstanceForAny(details, now)), [eventsAll, now]);

    if (events.length === 0) {
        return null;
    }

    return (
        <>
            <Section title={t("current_title")} subtitle={t("current_subtitle")} icon={"clock"} />
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
