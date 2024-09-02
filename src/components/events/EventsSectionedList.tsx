import { FlashList } from "@shopify/flash-list";
import { FC, ReactElement, useMemo } from "react";
import { StyleSheet, Vibration } from "react-native";

import { useThemeName } from "../../hooks/themes/useThemeHooks";
import { EventsByDayProps } from "../../routes/events/EventsByDay";
import { EventsByRoomProps } from "../../routes/events/EventsByRoom";
import { EventsByTrackProps } from "../../routes/events/EventsByTrack";
import { EventsSearchProps } from "../../routes/events/EventsSearch";
import { PersonalScheduleProps } from "../../routes/events/PersonalSchedule";
import { EventDetails } from "../../store/eurofurence/types";
import { findIndices } from "../../util/findIndices";
import { useSynchronizer } from "../sync/SynchronizationProvider";
import { EventSection, EventSectionProps } from "./EventSection";
import { EventCard, EventDetailsInstance } from "./EventCard";

/**
 * The properties to the component.
 */
export type EventsSectionedListProps = {
    navigation:
        | EventsSearchProps["navigation"]
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
    sticky?: boolean;
    padEnd?: boolean;
};

export const EventsSectionedList: FC<EventsSectionedListProps> = ({
    navigation,
    leader,
    eventsGroups,
    select,
    empty,
    trailer,
    cardType = "duration",
    sticky = true,
    padEnd = true,
}) => {
    const theme = useThemeName();
    const synchronizer = useSynchronizer();
    const stickyIndices = useMemo(() => (sticky ? findIndices(eventsGroups, (item) => !("details" in item)) : undefined), [eventsGroups, sticky]);

    return (
        <FlashList
            refreshing={synchronizer.isSynchronizing}
            onRefresh={synchronizer.synchronizeUi}
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
                    return (
                        <EventCard
                            containerStyle={styles.item}
                            event={item}
                            type={cardType}
                            onPress={(event) =>
                                navigation.navigate("Event", {
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
