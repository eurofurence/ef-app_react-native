import { useRoute } from "@react-navigation/core";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "../../components/Containers/Header";
import { Scroller } from "../../components/Containers/Scroller";
import { useTopHeaderStyle } from "../../hooks/useTopHeaderStyle";
import { useAppSelector } from "../../store";
import { eventsSelector } from "../../store/eurofurence.selectors";
import { EventContent } from "./EventContent";

/**
 * Params handled by the screen in route.
 */
export type EventScreenParams = {
    /**
     * The ID, needed if the event is not passed explicitly, i.e., as an external link.
     */
    id: string;
};

export const EventScreen = () => {
    const route = useRoute<Route<EventScreenParams, "Event">>();
    const event = useAppSelector((state) => eventsSelector.selectCompleteEventById(state, route.params.id));
    const headerStyle = useTopHeaderStyle();

    return (
        <View style={StyleSheet.absoluteFill}>
            <Header style={headerStyle}>{event?.Title ?? "Viewing event"}</Header>
            <Scroller>{!event ? null : <EventContent event={event} day={event.ConferenceDay} track={event.ConferenceTrack} room={event.ConferenceRoom} />}</Scroller>
        </View>
    );
};
