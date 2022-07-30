import { View } from "react-native";

import { Section } from "../../components/Atoms/Section";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { eventsSelectors } from "../../store/eurofurence.selectors";
import { EventCard } from "./EventCard";

export const UpcomingFavoriteEventsList = () => {
    const [now] = useNow();
    const navigation = useAppNavigation("Areas");
    const events = useAppSelector((state) => eventsSelectors.selectEnrichedEvents(state, eventsSelectors.selectUpcomingFavorites(state, now)));

    if (events.length === 0) {
        return null;
    }

    return (
        <View>
            <Section title={"Favorite Events"} subtitle={"You will receive a reminder before this event starts"} icon={"book-marker"} />
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
