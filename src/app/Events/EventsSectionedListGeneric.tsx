import { ListRenderItemInfo } from "@react-native/virtualized-lists/Lists/VirtualizedList";
import { FC, ReactNode, useCallback, useMemo } from "react";
import { SectionList, StyleSheet, Vibration } from "react-native";
import { SectionListData } from "react-native/Libraries/Lists/SectionList";

import { EventCard } from "./EventCard";
import { EventSection, EventSectionProps } from "./EventSection";
import { useSynchronizer } from "../../components/Synchronization/SynchronizationProvider";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { EventDetails } from "../../store/eurofurence.types";

export type EventsSectionedListItem = EventSectionProps & {
    data: EventDetails[];
};

/**
 * The properties to the component.
 */
export type EventsSectionedListGenericProps = {
    leader?: ReactNode;
    eventsGroups: EventsSectionedListItem[];
    select?: (event: EventDetails) => void;
    empty?: ReactNode;
    trailer?: ReactNode;
    cardType?: "duration" | "time";
};

export const EventsSectionedListGeneric: FC<EventsSectionedListGenericProps> = ({ leader, eventsGroups, select, empty, trailer, cardType = "duration" }) => {
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

    const keyExtractor = useCallback(({ Id }: EventDetails) => Id, []);
    const renderSection = useCallback(({ section }: SectionListData<any, any>) => {
        return <EventSection title={section.title} subtitle={section.subtitle} icon={section.icon} />;
    }, []);
    const renderItem = useCallback(
        ({ item }: ListRenderItemInfo<EventDetails>) => {
            return <EventCard key={item.Id} event={item} type={cardType} onPress={onPress} onLongPress={onLongPress} />;
        },
        [onPress, onLongPress],
    );

    return (
        <SectionList
            refreshing={synchronizer.isSynchronizing}
            onRefresh={synchronizer.synchronize}
            style={styles.list}
            contentContainerStyle={styles.container}
            scrollEnabled={true}
            ListHeaderComponent={headerComponent}
            ListFooterComponent={footerComponent}
            ListEmptyComponent={emptyComponent}
            sections={eventsGroups}
            keyExtractor={keyExtractor}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            renderSectionHeader={renderSection}
            renderItem={renderItem}
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
