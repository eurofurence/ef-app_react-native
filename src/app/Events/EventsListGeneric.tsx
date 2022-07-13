import moment, { Moment } from "moment";
import { FC, ReactNode, useCallback, useState } from "react";
import { FlatList, ImageSourcePropType, StyleSheet, Vibration, View } from "react-native";

import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { createImageUrl } from "../../store/eurofurence.enrichers";
import { eventRoomsSelectors } from "../../store/eurofurence.selectors";
import { EventRecord } from "../../store/eurofurence.types";
import { EventActionsSheet } from "./EventActionsSheet";
import { EventCard } from "./EventCard";
import { EventsListByDayScreenProps } from "./EventsListByDayScreen";

/**
 * The properties to the component.
 */
export type EventsListGenericProps = {
    /**
     * Navigation type. Copied from the screens rendering this component.
     */
    navigation: EventsListByDayScreenProps["navigation"];
    leader?: ReactNode;
    events: EventRecord[];
    trailer?: ReactNode;
};

export const EventsListGeneric: FC<EventsListGenericProps> = ({ navigation, leader, events, trailer }) => {
    const [now] = useNow();

    // Set event for action sheet
    const [selectedEvent, setSelectedEvent] = useState<EventRecord | undefined>(undefined);
    const rooms = useAppSelector(eventRoomsSelectors.selectAll);

    // Prepare navigation callback. This clones the respective parameters, as otherwise illegal mutation will occur.
    const navigateTo = useCallback(
        (event: EventRecord) =>
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
                renderItem={(entry: { item: EventRecord }) => (
                    <EventCard
                        key={entry.item.Id}
                        background={eventBanner(entry.item)}
                        pre={eventDuration(entry.item)}
                        title={entry.item.Title}
                        subtitle={rooms.find((room) => room.Id === entry.item.ConferenceRoomId)?.Name}
                        tag={entry.item.PanelHosts}
                        happening={eventHappening(entry.item, now)}
                        done={eventDone(entry.item, now)}
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

// TODO: Plase see if we will have an enriched format here too.

const eventDuration = (event: EventRecord) => {
    const duration = moment.duration(event.Duration);
    if (duration.asMinutes() > 59) return duration.asHours() + "h";
    else return duration.asMinutes() + "m";
};

const eventBanner = (event: EventRecord): ImageSourcePropType | undefined => (event.BannerImageId ? { uri: createImageUrl(event.BannerImageId) } : undefined);

const eventHappening = (event: EventRecord, now: Moment): boolean => now.isBetween(event.StartDateTimeUtc, event.EndDateTimeUtc);

const eventDone = (event: EventRecord, now: Moment): boolean => now.isAfter(event.EndDateTimeUtc);
