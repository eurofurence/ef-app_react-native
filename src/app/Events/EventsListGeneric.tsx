import { FC, ReactNode, useCallback } from "react";
import { FlatList, StyleSheet, Vibration } from "react-native";

import { EventDetails } from "../../store/eurofurence.types";
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
    select?: (event: EventDetails) => void;
    empty?: ReactNode;
    trailer?: ReactNode;
    cardType?: "duration" | "time";
};

export const EventsListGeneric: FC<EventsListGenericProps> = ({ navigation, leader, events, select, empty, trailer, cardType = "duration" }) => {
    // Prepare navigation callback. This clones the respective parameters, as otherwise illegal mutation will occur.
    const navigateTo = useCallback(
        (event: EventDetails) =>
            navigation.push("Event", {
                id: event.Id,
            }),
        [navigation]
    );

    return (
        <FlatList
            style={styles.list}
            contentContainerStyle={styles.container}
            scrollEnabled={true}
            ListHeaderComponent={<>{leader}</>}
            ListFooterComponent={<>{trailer}</>}
            ListEmptyComponent={<>{empty}</>}
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
                        select && select(entry.item);
                    }}
                />
            )}
        />
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
