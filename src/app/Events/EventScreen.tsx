import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { appStyles } from "../../components/app/AppStyles";
import { EventContent } from "../../components/app/events/EventContent";
import { Floater, padFloater } from "../../components/generic/containers/Floater";
import { Header } from "../../components/generic/containers/Header";
import { useAppRoute } from "../../hooks/nav/useAppNavigation";
import { useAppSelector } from "../../store";
import { eventsSelector } from "../../store/eurofurence.selectors";

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
    const event = useAppSelector((state) => eventsSelector.selectById(state, route.params.id));

    return (
        <ScrollView style={[appStyles.abs, safe]} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header>{event?.Title ?? "Viewing event"}</Header>
            <Floater contentStyle={appStyles.trailer}>{!event ? null : <EventContent event={event} parentPad={padFloater} />}</Floater>
        </ScrollView>
    );
};
