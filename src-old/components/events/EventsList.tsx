import { FlashList } from "@shopify/flash-list";
import { FC, ReactElement, useCallback } from "react";
import { StyleSheet, Vibration } from "react-native";

import { useThemeName } from "../../hooks/themes/useThemeHooks";
import { EventsByDayProps } from "../../routes/events/EventsByDay";
import { EventsByRoomProps } from "../../routes/events/EventsByRoom";
import { EventsByTrackProps } from "../../routes/events/EventsByTrack";
import { EventsSearchProps } from "../../routes/events/EventsSearch";
import { PersonalScheduleProps } from "../../routes/events/PersonalSchedule";
import { EventDetails } from "../../store/eurofurence/types";
import { useSynchronizer } from "../sync/SynchronizationProvider";
import { EventCard, EventDetailsInstance } from "./EventCard";

/**
 * The properties to the component.
 */
export type EventsListProps = {
    navigation:
        | EventsSearchProps["navigation"]
        | EventsByDayProps["navigation"]
        | EventsByRoomProps["navigation"]
        | EventsByTrackProps["navigation"]
        | PersonalScheduleProps["navigation"];
    leader?: ReactElement;
    events: EventDetailsInstance[];
    select?: (event: EventDetails) => void;
    empty?: ReactElement;
    trailer?: ReactElement;
    cardType?: "duration" | "time";
    padEnd?: boolean;
};

export const EventsList: FC<EventsListProps> = ({ navigation, leader, events, select, empty, trailer, cardType = "duration", padEnd = true }) => {
    const theme = useThemeName();
    const synchronizer = useSynchronizer();
    const onPress = useCallback(
        (event: EventDetails) => {
            navigation.navigate("Event", {
                id: event.Id,
            });
        },
        [navigation],
    );
    const onLongPress = useCallback(
        (event: EventDetails) => {
            Vibration.vibrate(50);
            select?.(event);
        },
        [select],
    );
    return (
        <FlashList
            refreshing={synchronizer.isSynchronizing}
            onRefresh={synchronizer.synchronizeUi}
            contentContainerStyle={padEnd ? styles.container : undefined}
            scrollEnabled={true}
            ListHeaderComponent={leader}
            ListFooterComponent={trailer}
            ListEmptyComponent={empty}
            data={events}
            keyExtractor={(item) => item.details.Id}
            renderItem={({ item }) => {
                return <EventCard containerStyle={styles.item} key={item.details.Id} event={item} type={cardType} onPress={onPress} onLongPress={onLongPress} />;
            }}
            estimatedItemSize={110}
            extraData={theme}
        />
    );
};

const styles = StyleSheet.create({
    item: {
        paddingHorizontal: 20,
    },
    container: {
        paddingBottom: 100,
    },
});
