import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { FC } from "react";

import { PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { useAppSelector } from "../../store";
import { eventsSelector } from "../../store/eurofurence.selectors";
import { EventTrackRecord } from "../../store/eurofurence.types";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";
import { EventsListGeneric } from "./EventsListGeneric";
import { EventsTabsScreenNavigatorParamsList } from "./EventsTabsScreen";

/**
 * Params handled by the screen in route.
 */
export type EventsListByTrackScreenParams = {
    /**
     * The track that's events are listed.
     */
    track: EventTrackRecord;
};

/**
 * The properties to the screen as a component.
 */
export type EventsListByTrackScreenProps = CompositeScreenProps<PagesScreenProps<EventsTabsScreenNavigatorParamsList, any>, StackScreenProps<ScreenStartNavigatorParamsList>>;

export const EventsListByTrackScreen: FC<EventsListByTrackScreenProps> = ({ navigation, route }) => {
    // Get the track. Use it to resolve events to display.
    const track = "track" in route.params ? route.params?.track : null;
    const eventsByTrack = useAppSelector((state) => eventsSelector.selectByTrack(state, track?.Id ?? ""));

    return <EventsListGeneric navigation={navigation} events={eventsByTrack} />;
};
