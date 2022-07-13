import { clone } from "lodash";
import moment, { Moment } from "moment";
import { FC, ReactNode, useCallback, useState } from "react";
import { ImageSourcePropType, SectionList, StyleSheet, Vibration, View } from "react-native";

import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { createImageUrl } from "../../store/eurofurence.enrichers";
import { eventDaysSelectors, eventRoomsSelectors, eventTracksSelectors } from "../../store/eurofurence.selectors";
import { EventRecord } from "../../store/eurofurence.types";
import { EventActionsSheet } from "./EventActionsSheet";
import { EventCard } from "./EventCard";
import { EventSection, EventSectionProps } from "./EventSection";
import { EventsListByDayScreenProps } from "./EventsListByDayScreen";

export type EventsSectionedListItem = EventSectionProps & { data: EventRecord[] };

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
};

export const EventsSectionedListGeneric: FC<EventsSectionedListGenericProps> = ({ navigation, leader, eventsGroups, trailer }) => {
    const [now] = useNow();

    // Use events,days, tracks, and rooms.
    const days = useAppSelector(eventDaysSelectors.selectAll);
    const tracks = useAppSelector(eventTracksSelectors.selectAll);
    const rooms = useAppSelector(eventRoomsSelectors.selectAll);

    // Set event for action sheet
    const [selectedEvent, setSelectedEvent] = useState<EventRecord | undefined>(undefined);

    // Prepare navigation callback. This clones the respective parameters, as otherwise illegal mutation will occur.
    const navigateTo = useCallback(
        (event) =>
            navigation.push("Event", {
                id: event.Id,
                event: clone(event),
                day: clone(days.find((day) => day.Id === event.ConferenceDayId)),
                track: clone(tracks.find((track) => track.Id === event.ConferenceTrackId)),
                room: clone(rooms.find((room) => room.Id === event.ConferenceRoomId)),
            }),
        [navigation, tracks, rooms]
    );

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
                renderSectionHeader={({ section }) => <EventSection timeUtc={section.timeUtc} />}
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
