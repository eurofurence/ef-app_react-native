import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { StyleSheet, Vibration } from "react-native";

import { EventCard } from "./EventCard";
import { EventsListByDayScreenProps } from "./EventsListByDayScreen";
import { EventsListByRoomScreenProps } from "./EventsListByRoomScreen";
import { EventsListByTrackScreenProps } from "./EventsListByTrackScreen";
import { EventsListSearchResultsScreenProps } from "./EventsListSearchResultsScreen";
import { EventsSearchScreenProps } from "./EventsSearchScreen";
import { useEventsRefreshKey } from "../../hooks/events/useEventsRefreshKey";
import { EventDetails } from "../../store/eurofurence.types";

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
    // Use refresh key.
    const refreshKey = useEventsRefreshKey();

    // Prepare navigation callback. This clones the respective parameters, as otherwise illegal mutation will occur.
    const navigateTo = useCallback(
        (event: EventDetails) =>
            navigation.push("Event", {
                id: event.Id,
            }),
        [navigation],
    );

    // Press and long press handlers.
    const onPress = useCallback((event: EventDetails) => navigateTo(event), [navigateTo]);
    const onLongPress = useCallback(
        (event: EventDetails) => {
            Vibration.vibrate(50);
            select?.(event);
        },
        [select],
    );

    const headerComponent = useMemo(() => <>{leader}</>, [leader]);
    const footerComponent = useMemo(() => <>{trailer}</>, [trailer]);
    const emptyComponent = useMemo(() => <>{empty}</>, [empty]);

    const keyExtractor = useCallback(({ Id }: EventDetails) => Id, []);
    const renderItem = useCallback(
        ({ item }: ListRenderItemInfo<EventDetails>) => {
            return <EventCard key={item.Id} event={item} type={cardType} onPress={onPress} onLongPress={onLongPress} />;
        },
        [onPress, onLongPress],
    );

    return (
        <FlashList
            contentContainerStyle={styles.container}
            scrollEnabled={true}
            ListHeaderComponent={headerComponent}
            ListFooterComponent={footerComponent}
            ListEmptyComponent={emptyComponent}
            data={events}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            estimatedItemSize={80}
            extraData={refreshKey}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
});
