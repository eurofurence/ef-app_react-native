import { FC, ReactNode, useCallback, useState } from "react";
import { SectionList, StyleSheet, Vibration, View } from "react-native";

import { EventWithDetails } from "../../store/eurofurence.selectors";
import { EventActionsSheet } from "./EventActionsSheet";
import { EventCard } from "./EventCard";
import { EventSection, EventSectionProps } from "./EventSection";
import { EventsListByDayScreenProps } from "./EventsListByDayScreen";

export type EventsSectionedListItem = EventSectionProps & {
    data: EventWithDetails[];
};

/**
 * The properties to the component.
 */
export type EventsSectionedListGenericProps = {
    /**
     * Navigation type. Copied from the screens rendering this component.
     */
    navigation: EventsListByDayScreenProps["navigation"];
    leader?: ReactNode;
    eventsGroups: EventsSectionedListItem[];
    trailer?: ReactNode;
    cardType?: "duration" | "time";
};

export const EventsSectionedListGeneric: FC<EventsSectionedListGenericProps> = ({ navigation, leader, eventsGroups, trailer, cardType = "duration" }) => {
    // Set event for action sheet
    const [selectedEvent, setSelectedEvent] = useState<EventWithDetails | undefined>(undefined);

    // Prepare navigation callback. This clones the respective parameters, as otherwise illegal mutation will occur.
    const navigateTo = useCallback((event) => navigation.push("Event", { id: event.Id }), [navigation]);

    return (
        <View style={StyleSheet.absoluteFill}>
            <SectionList
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
                renderItem={(entry: { item: EventWithDetails }) => (
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
