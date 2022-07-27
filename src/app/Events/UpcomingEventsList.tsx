import { useNavigation } from "@react-navigation/core";
import { useEffect } from "react";
import { View } from "react-native";

import { Section } from "../../components/Atoms/Section";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { eventsCompleteSelectors, eventsSelectors } from "../../store/eurofurence.selectors";
import { EventCard } from "./EventCard";
import { EventsListGeneric } from "./EventsListGeneric";

export const UpcomingEventsList = () => {
    const navigation = useAppNavigation("Areas");
    const [now] = useNow();
    const events = useAppSelector((state) => eventsSelectors.selectEnrichedEvents(state, eventsSelectors.selectUpcomingEvents(state, now)));

    if (events.length === 0) {
        return null;
    }

    return (
        <View>
            <Section title={"Upcoming Events"} subtitle={"These events are starting in the next 30 minutes"} icon={"clock"} />
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
