import { ScrollView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { EventContent } from "./EventContent";
import { Floater, padFloater } from "../../components/Containers/Floater";
import { Header } from "../../components/Containers/Header";
import { useAppRoute } from "../../hooks/navigation/useAppNavigation";
import { useAppSelector } from "../../store";
import { eventsSelector } from "../../store/eurofurence.selectors";
import { appStyles } from "../AppStyles";

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
