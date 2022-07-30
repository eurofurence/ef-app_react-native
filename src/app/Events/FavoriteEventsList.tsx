import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { Section } from "../../components/Atoms/Section";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useAppSelector } from "../../store";
import { eventsSelectors } from "../../store/eurofurence.selectors";
import { EventCard } from "./EventCard";

export const FavoriteEventsList = () => {
    const { t } = useTranslation("Events");
    const navigation = useAppNavigation("Areas");
    const events = useAppSelector((state) => eventsSelectors.selectEnrichedEvents(state, eventsSelectors.selectFavorites(state)));

    if (events.length === 0) {
        return null;
    }

    // TODO: move this to a nice sectioned list
    return (
        <View style={{ paddingHorizontal: 20, paddingBottom: 100 }}>
            <Section title={t("favorites_title")} subtitle={t("favorites_subtitle")} icon={"bookmark"} />
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
        </View>
    );
};
