import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { EventCard } from "./EventCard";
import { Section } from "../../components/Atoms/Section";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { selectCurrentEvents } from "../../store/eurofurence.selectors";
import { EventDetails } from "../../store/eurofurence.types";

export const CurrentEventList = () => {
    const { t } = useTranslation("Events");

    const navigation = useAppNavigation("Areas");
    const [now] = useNow();
    const events = useAppSelector((state) => selectCurrentEvents(state, now));

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
            <Section title={t("current_title")} subtitle={t("current_subtitle")} icon={"clock"} />
            {events.map((event) => (
                <EventCard key={event.Id} event={event} type="time" onPress={onPress} />
            ))}
        </>
    );
};
