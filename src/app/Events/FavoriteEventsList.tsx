import { useNavigation } from "@react-navigation/core";
import { useEffect } from "react";
import { Vibration, View } from "react-native";

import { Section } from "../../components/Atoms/Section";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { eventsCompleteSelectors, eventsSelectors } from "../../store/eurofurence.selectors";
import { EventCard } from "./EventCard";
import { EventsListGeneric } from "./EventsListGeneric";

export const FavoriteEventsList = () => {
    const navigation = useAppNavigation("Home");
    const events = useAppSelector((state) => eventsSelectors.selectEnrichedEvents(state, eventsSelectors.selectFavorites(state)));

    if (events.length === 0) {
        return null;
    }

    return (
        <View>
            <Section title={"Favorite Events"} subtitle={"You will receive a reminder about these events"} icon={"bookmark"} />
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
