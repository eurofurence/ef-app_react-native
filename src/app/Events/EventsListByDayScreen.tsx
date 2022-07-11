import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { FC } from "react";

import { PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { useAppSelector } from "../../store";
import { eventsSelector } from "../../store/eurofurence.selectors";
import { EventDayRecord } from "../../store/eurofurence.types";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";
import { EventsListGeneric } from "./EventsListGeneric";
import { EventsTabsScreenNavigatorParamsList } from "./EventsTabsScreen";

/**
 * Params handled by the screen in route.
 */
export type EventsListByDayScreenParams = {
    /**
     * The day that's events are listed.
     */
    day: EventDayRecord;
};

/**
 * The properties to the screen as a component.
 */
export type EventsListByDayScreenProps = CompositeScreenProps<PagesScreenProps<EventsTabsScreenNavigatorParamsList, any>, StackScreenProps<ScreenStartNavigatorParamsList>>;

export const EventsListByDayScreen: FC<EventsListByDayScreenProps> = ({ navigation, route }) => {
    // Get the day. Use it to resolve events to display.
    const day = "day" in route.params ? route.params?.day : null;
    const eventsByDay = useAppSelector((state) => eventsSelector.selectByDay(state, day?.Id ?? ""));

    return <EventsListGeneric navigation={navigation} events={eventsByDay} />;
};
