import { FC, ReactNode, useCallback, useState } from "react";
import { FlatList, StyleSheet, Vibration, View } from "react-native";

import { EventDetails } from "../../store/eurofurence.types";
import { EventActionsSheet } from "./EventActionsSheet";
import { EventCard } from "./EventCard";
import { EventsListByDayScreenProps } from "./EventsListByDayScreen";
import { EventsListByRoomScreenProps } from "./EventsListByRoomScreen";
import { EventsListByTrackScreenProps } from "./EventsListByTrackScreen";
import { EventsListSearchResultsScreenProps } from "./EventsListSearchResultsScreen";
import { EventsSearchScreenProps } from "./EventsSearchScreen";

/**
 * The properties to the component.
 */
export type EventsListGenericProps = {
    /**
     * Navigation type. Copied from the screens rendering this component.
     */
    navigation:
        | EventsSearchScreenProps["navigation"]
        | EventsListSearchResultsScreenProps["navigation"]
        | EventsListByDayScreenProps["navigation"]
        | EventsListByRoomScreenProps["navigation"]
        | EventsListByTrackScreenProps["navigation"];
    leader?: ReactNode;
    events: EventDetails[];
    trailer?: ReactNode;
    cardType?: "duration" | "time";
};

export const EventsListGeneric: FC<EventsListGenericProps> = ({ navigation, leader, events, trailer, cardType = "duration" }) => {
    // Set event for action sheet
    const [selectedEvent, setSelectedEvent] = useState<EventDetails | undefined>(undefined);

    // Prepare navigation callback. This clones the respective parameters, as otherwise illegal mutation will occur.
    const navigateTo = useCallback(
        (event: EventDetails) =>
            navigation.push("Event", {
                id: event.Id,
            }),
        [navigation]
    );

    return (
        <View style={StyleSheet.absoluteFill}>
            <FlatList
                style={styles.list}
                contentContainerStyle={styles.container}
                scrollEnabled={true}
                ListHeaderComponent={<>{leader}</>}
                ListFooterComponent={<>{trailer}</>}
                data={events}
                keyExtractor={(item) => item.Id}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                renderItem={(entry: { item: EventDetails }) => (
                    <EventCard
                        key={entry.item.Id}
                        event={entry.item}
                        type={cardType}
                        onPress={() => navigateTo(entry.item)}
                        onLongPress={() => {
                            Vibration.vibrate(50);
                            setSelectedEvent(entry.item);
                        }}
                    />
                )}
            />
            <EventActionsSheet eventRecord={selectedEvent} onClose={() => setSelectedEvent(undefined)} />
        </View>
    );
};

const styles = StyleSheet.create({
    list: {
        flex: 1,
    },
    container: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
});
