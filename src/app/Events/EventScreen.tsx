import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Header } from "../../components/Containers/Header";
import { Scroller } from "../../components/Containers/Scroller";
import { useAppRoute } from "../../hooks/useAppNavigation";
import { useTopHeaderStyle } from "../../hooks/useTopHeaderStyle";
import { useAppSelector } from "../../store";
import { eventsCompleteSelectors } from "../../store/eurofurence.selectors";
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
    const safe = useSafeAreaInsets();
    const route = useAppRoute("Event");
    const event = useAppSelector((state) => eventsCompleteSelectors.selectById(state, route.params.id));

    return (
        <ScrollView style={safe} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header>{event?.Title ?? "Viewing event"}</Header>
            <Scroller>{!event ? null : <EventContent event={event} />}</Scroller>
        </ScrollView>
    );
};
