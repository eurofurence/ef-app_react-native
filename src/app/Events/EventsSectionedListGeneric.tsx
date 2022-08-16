import { FC, ReactNode, useCallback, useState } from "react";
import { SectionList, StyleSheet, Vibration, View } from "react-native";

import { useSynchronizer } from "../../components/Synchronization/SynchronizationProvider";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { EventDetails } from "../../store/eurofurence.types";
import { EventActionsSheet } from "./EventActionsSheet";
import { EventCard } from "./EventCard";
import { EventSection, EventSectionProps } from "./EventSection";

export type EventsSectionedListItem = EventSectionProps & {
    data: EventDetails[];
};

/**
 * The properties to the component.
 */
export type EventsSectionedListGenericProps = {
    leader?: ReactNode;
    eventsGroups: EventsSectionedListItem[];
    trailer?: ReactNode;
    cardType?: "duration" | "time";
};

export const EventsSectionedListGeneric: FC<EventsSectionedListGenericProps> = ({ leader, eventsGroups, trailer, cardType = "duration" }) => {
    const navigation = useAppNavigation("Areas");
    // Set event for action sheet
    const [selectedEvent, setSelectedEvent] = useState<EventDetails | undefined>(undefined);

    // Prepare navigation callback. This clones the respective parameters, as otherwise illegal mutation will occur.
    const navigateTo = useCallback((event) => navigation.push("Event", { id: event.Id }), [navigation]);
    const synchronizer = useSynchronizer();

    return (
        <View style={StyleSheet.absoluteFill}>
            <SectionList
                refreshing={synchronizer.isSynchronizing}
                onRefresh={synchronizer.synchronize}
                style={styles.list}
                contentContainerStyle={styles.container}
                scrollEnabled={true}
                ListHeaderComponent={<>{leader}</>}
                ListFooterComponent={<>{trailer}</>}
                sections={eventsGroups}
                keyExtractor={(item) => item.Id}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                renderSectionHeader={({ section }) => <EventSection title={section.title} subtitle={section.subtitle} icon={section.icon} />}
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
