import { useTranslation } from "react-i18next";

import { Section } from "../../components/Atoms/Section";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { selectCurrentEvents } from "../../store/eurofurence.selectors";
import { EventCard } from "./EventCard";

export const CurrentEventList = () => {
    const { t } = useTranslation("Events");

    const navigation = useAppNavigation("Areas");
    const [now] = useNow();
    const events = useAppSelector((state) => selectCurrentEvents(state, now));

    if (events.length === 0) {
        return null;
    }

    return (
        <>
            <Section title={t("current_title")} subtitle={t("current_subtitle")} icon={"clock"} />
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
