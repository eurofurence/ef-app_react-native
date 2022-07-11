import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { clone } from "lodash";
import { FC, ReactNode, useCallback, useState } from "react";
import { FlatList, StyleSheet, Vibration, View } from "react-native";

import { Button } from "../../components/Containers/Button";
import { PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { useAppSelector } from "../../store";
import { eventDaysSelectors, eventRoomsSelectors, eventTracksSelectors } from "../../store/eurofurence.selectors";
import { EventRecord } from "../../store/eurofurence.types";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";
import { EventActionsSheet } from "./EventActionsSheet";
import { EventsTabsScreenNavigatorParamsList } from "./EventsTabsScreen";

/**
 * The properties to the component.
 */
export type EventsListGenericProps = {
    navigation: CompositeScreenProps<PagesScreenProps<EventsTabsScreenNavigatorParamsList, any>, StackScreenProps<ScreenStartNavigatorParamsList>>["navigation"];
    leader?: ReactNode;
    events: EventRecord[];
    trailer?: ReactNode;
};

export const EventsListGeneric: FC<EventsListGenericProps> = ({ navigation, leader, events, trailer }) => {
    // Use events,days, tracks, and rooms.
    const days = useAppSelector(eventDaysSelectors.selectAll);
    const tracks = useAppSelector(eventTracksSelectors.selectAll);
    const rooms = useAppSelector(eventRoomsSelectors.selectAll);

    // Set event for action sheet
    const [selectedEvent, setSelectedEvent] = useState<EventRecord | undefined>(undefined);

    // Prepare navigation callback. This clones the respective parameters, as otherwise illegal mutation will occur.
    const navigateTo = useCallback(
        (event) =>
            navigation.push("Event", {
                id: event.Id,
                event: clone(event),
                day: clone(days.find((day) => day.Id === event.ConferenceDayId)),
                track: clone(tracks.find((track) => track.Id === event.ConferenceTrackId)),
                room: clone(rooms.find((room) => room.Id === event.ConferenceRoomId)),
            }),
        [navigation, tracks, rooms]
    );

    return (
        <View style={StyleSheet.absoluteFill}>
            <FlatList
                scrollEnabled={true}
                ListHeaderComponent={<>{leader}</>}
                ListFooterComponent={<>{trailer}</>}
                data={events}
                renderItem={(entry: { item: EventRecord }) => (
                    <View key={entry.item.Id} style={{ padding: 10 }}>
                        <Button
                            outline
                            onPress={() => navigateTo(entry.item)}
                            onLongPress={() => {
                                Vibration.vibrate(50);
                                setSelectedEvent(entry.item);
                            }}
                        >
                            {entry.item.Title}
                        </Button>
                    </View>
                )}
            />
            <EventActionsSheet eventRecord={selectedEvent} onClose={() => setSelectedEvent(undefined)} />
        </View>
    );
};
