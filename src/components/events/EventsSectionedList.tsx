import { FlashList } from "@shopify/flash-list";
import { FC, ReactElement, useCallback, useMemo } from "react";
import { StyleSheet, Vibration } from "react-native";

import { router } from "expo-router";
import { EventSection, EventSectionProps } from "./EventSection";
import { EventCard, EventDetailsInstance } from "./EventCard";
import { useThemeName } from "@/hooks/themes/useThemeHooks";
import { EventDetails } from "@/store/eurofurence/types";
import { findIndices } from "@/util/findIndices";
import { useDataCache } from "@/context/DataCacheProvider";

/**
 * The properties to the component.
 */
export type EventsSectionedListProps = {
    leader?: ReactElement;
    eventsGroups: (EventSectionProps | EventDetailsInstance)[];
    select?: (event: EventDetails) => void;
    empty?: ReactElement;
    trailer?: ReactElement;
    cardType?: "duration" | "time";
    sticky?: boolean;
    padEnd?: boolean;
};

export const EventsSectionedList: FC<EventsSectionedListProps> = ({ leader, eventsGroups, select, empty, trailer, cardType = "duration", sticky = true, padEnd = true }) => {
    const theme = useThemeName();
    const { isSynchronizing, synchronizeUi } = useDataCache();
    const stickyIndices = useMemo(() => (sticky ? findIndices(eventsGroups, (item) => !("details" in item)) : undefined), [eventsGroups, sticky]);
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
            stickyHeaderIndices={stickyIndices}
            ListHeaderComponent={leader}
            ListFooterComponent={trailer}
            ListEmptyComponent={empty}
            data={eventsGroups}
            getItemType={(item) => ("details" in item ? "row" : "sectionHeader")}
            keyExtractor={(item) => ("details" in item ? item.details.Id : item.title)}
            renderItem={({ item }) => {
                if ("details" in item) {
                    return <EventCard containerStyle={styles.item} event={item} type={cardType} onPress={onPress} onLongPress={onLongPress} />;
                } else {
                    return <EventSection style={styles.item} title={item.title} subtitle={item.subtitle} icon={item.icon} />;
                }
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
