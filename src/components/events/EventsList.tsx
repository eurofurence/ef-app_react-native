import { FlashList } from "@shopify/flash-list";
import { FC, ReactElement, useCallback } from "react";
import { StyleSheet, Vibration } from "react-native";

import { router } from "expo-router";
import { EventCard, EventDetailsInstance } from "./EventCard";
import { useThemeName } from "@/hooks/themes/useThemeHooks";
import { EventDetails } from "@/store/eurofurence/types";
import { useDataCache } from "@/context/DataCacheProvider";

/**
 * The properties to the component.
 */
export type EventsListProps = {
    leader?: ReactElement;
    events: EventDetailsInstance[];
    select?: (event: EventDetails) => void;
    empty?: ReactElement;
    trailer?: ReactElement;
    cardType?: "duration" | "time";
    padEnd?: boolean;
};

export const EventsList: FC<EventsListProps> = ({ leader, events, select, empty, trailer, cardType = "duration", padEnd = true }) => {
    const theme = useThemeName();
    const { isSynchronizing, synchronizeUi } = useDataCache();
    const onPress = useCallback((event: EventDetails) => {
        router.navigate({
            pathname: "/events/[eventId]",
            params: { eventId: event.Id },
        });
    }, []);
    const onLongPress = useCallback(
        (event: EventDetails) => {
            Vibration.vibrate(50);
            select?.(event);
        },
        [select],
    );
    return (
        <FlashList
            refreshing={isSynchronizing}
            onRefresh={synchronizeUi}
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
