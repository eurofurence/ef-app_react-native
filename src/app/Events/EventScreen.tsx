import { useRoute } from "@react-navigation/core";
import { StyleSheet, View } from "react-native";

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
    const route = useAppRoute("Event");
    const event = useAppSelector((state) => eventsCompleteSelectors.selectById(state, route.params.id));
    const headerStyle = useTopHeaderStyle();

    return (
        <View style={StyleSheet.absoluteFill}>
            <Header style={headerStyle}>{event?.Title ?? "Viewing event"}</Header>
            <Scroller>{!event ? null : <EventContent event={event} />}</Scroller>
        </View>
    );
};
