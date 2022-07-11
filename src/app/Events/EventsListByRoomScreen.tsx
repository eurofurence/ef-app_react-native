import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { FC } from "react";
import { View } from "react-native";

import { Section } from "../../components/Atoms/Section";
import { PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { useAppSelector } from "../../store";
import { eventsSelector } from "../../store/eurofurence.selectors";
import { EventRoomRecord } from "../../store/eurofurence.types";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";
import { EventsListGeneric } from "./EventsListGeneric";
import { EventsTabsScreenNavigatorParamsList } from "./EventsTabsScreen";

/**
 * Params handled by the screen in route.
 */
export type EventsListByRoomScreenParams = {
    /**
     * The room that's events are listed.
     */
    room: EventRoomRecord;
};

/**
 * The properties to the screen as a component.
 */
export type EventsListByRoomScreenProps = CompositeScreenProps<PagesScreenProps<EventsTabsScreenNavigatorParamsList, any>, StackScreenProps<ScreenStartNavigatorParamsList>>;

export const EventsListByRoomScreen: FC<EventsListByRoomScreenProps> = ({ navigation, route }) => {
    // Get the room. Use it to resolve events to display.
    const room = "room" in route.params ? route.params?.room : null;
    const eventsByRoom = useAppSelector((state) => eventsSelector.selectByRoom(state, room?.Id ?? ""));

    return (
        <EventsListGeneric
            navigation={navigation}
            events={eventsByRoom}
            leader={
                <View style={{ paddingHorizontal: 30 }}>
                    <Section title={room?.Name ?? ""} subtitle={`${eventsByRoom.length} events in total`} />
                </View>
            }
        />
    );
};
