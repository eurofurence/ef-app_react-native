import { FlashList, ListRenderItemInfo } from "@shopify/flash-list";
import { FC, ReactElement } from "react";
import { StyleSheet, Vibration } from "react-native";

import { EventCard, EventDetailsInstance } from "./EventCard";
import { EventSection, EventSectionProps } from "./EventSection";
import { PersonalScheduleProps } from "./PersonalSchedule";
import { useEventsRefreshKey } from "../../../hooks/events/useEventsRefreshKey";
import { EventsByDayProps } from "../../../routes/events/EventsByDay";
import { EventsByRoomProps } from "../../../routes/events/EventsByRoom";
import { EventsByTrackProps } from "../../../routes/events/EventsByTrack";
import { EventsResultsProps } from "../../../routes/events/EventsResults";
import { EventsSearchProps } from "../../../routes/events/EventsSearch";
import { EventDetails } from "../../../store/eurofurence.types";
import { useSynchronizer } from "../sync/SynchronizationProvider";

/**
 * The properties to the component.
 */
export type EventsSectionedListProps = {
    navigation:
        | EventsSearchProps["navigation"]
        | EventsResultsProps["navigation"]
        | EventsByDayProps["navigation"]
        | EventsByRoomProps["navigation"]
        | EventsByTrackProps["navigation"]
        | PersonalScheduleProps["navigation"];
    leader?: ReactElement;
    eventsGroups: (EventSectionProps | EventDetailsInstance)[];
    select?: (event: EventDetails) => void;
    empty?: ReactElement;
    trailer?: ReactElement;
    cardType?: "duration" | "time";
};

export const EventsSectionedList: FC<EventsSectionedListProps> = ({ navigation, leader, eventsGroups, select, empty, trailer, cardType = "duration" }) => {
    // Use refresh key.
    const refreshKey = useEventsRefreshKey();
    const synchronizer = useSynchronizer();

    return (
        <FlashList
            refreshing={synchronizer.isSynchronizing}
            onRefresh={synchronizer.synchronize}
            contentContainerStyle={styles.container}
            scrollEnabled={true}
            ListHeaderComponent={leader}
            ListFooterComponent={trailer}
            ListEmptyComponent={empty}
            data={eventsGroups}
            getItemType={(item) => ("details" in item ? "row" : "sectionHeader")}
            keyExtractor={(item) => ("details" in item ? item.details.Id : item.title)}
            renderItem={({ item }) => {
                if ("details" in item) {
                    return (
                        <EventCard
                            event={item}
                            type={cardType}
                            onPress={(event) =>
                                navigation.push("Event", {
                                    id: event.Id,
                                })
                            }
                            onLongPress={(event) => {
                                Vibration.vibrate(50);
                                select?.(event);
                            }}
                        />
                    );
                } else {
                    return <EventSection title={item.title} subtitle={item.subtitle} icon={item.icon} />;
                }
            }}
            estimatedItemSize={110}
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
