import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { StyleSheet, Vibration } from "react-native";

import { EventCard } from "./EventCard";
import { EventSection, EventSectionProps } from "./EventSection";
import { useSynchronizer } from "../../components/Synchronization/SynchronizationProvider";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { useEventsRefreshKey } from "../../hooks/useEventsRefreshKey";
import { EventDetails } from "../../store/eurofurence.types";

/**
 * The properties to the component.
 */
export type EventsSectionedListGenericProps = {
    leader?: ReactNode;
    eventsGroups: (EventSectionProps | EventDetails)[];
    select?: (event: EventDetails) => void;
    empty?: ReactNode;
    trailer?: ReactNode;
    cardType?: "duration" | "time";
};

export const EventsSectionedListGeneric: FC<EventsSectionedListGenericProps> = ({ leader, eventsGroups, select, empty, trailer, cardType = "duration" }) => {
    // Use refresh key.
    const refreshKey = useEventsRefreshKey();

    const navigation = useAppNavigation("Areas");

    // Prepare navigation callback. This clones the respective parameters, as otherwise illegal mutation will occur.
    const navigateTo = useCallback((event: EventDetails) => navigation.push("Event", { id: event.Id }), [navigation]);
    const synchronizer = useSynchronizer();

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

    const getItemType = useCallback((item: EventSectionProps | EventDetails) => ("Id" in item ? "row" : "sectionHeader"), []);
    const renderItem = useCallback(
        ({ item }: ListRenderItemInfo<EventSectionProps | EventDetails>) => {
            if ("Id" in item) return <EventCard event={item} type={cardType} onPress={onPress} onLongPress={onLongPress} />;
            else return <EventSection title={item.title} subtitle={item.subtitle} icon={item.icon} />;
        },
        [onPress, onLongPress],
    );

    return (
        <FlashList
            refreshing={synchronizer.isSynchronizing}
            onRefresh={synchronizer.synchronize}
            contentContainerStyle={styles.container}
            scrollEnabled={true}
            ListHeaderComponent={headerComponent}
            ListFooterComponent={footerComponent}
            ListEmptyComponent={emptyComponent}
            data={eventsGroups}
            getItemType={getItemType}
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
