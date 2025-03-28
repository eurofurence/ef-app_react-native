import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

import { appStyles } from "@/components/AppStyles";
import { EventContent } from "@/components/events/EventContent";
import { Floater, padFloater } from "@/components/generic/containers/Floater";
import { Header } from "@/components/generic/containers/Header";
import { useUpdateSinceNote } from "@/hooks/records/useUpdateSinceNote";
import { useLatchTrue } from "@/hooks/util/useLatchTrue";
import { useDataCache } from "@/context/DataCacheProvider";
import { platformShareIcon } from "@/components/generic/atoms/Icon";
import { shareEvent } from "@/components/events/Events.common";
import { useThemeBackground } from "@/hooks/themes/useThemeHooks";
import { EventDetails } from "@/store/eurofurence/types";

export default function EventItem() {
    const { t } = useTranslation("Event");
    const { eventId } = useLocalSearchParams<{ eventId: string }>();
    const { getCacheSync, saveCache } = useDataCache();
    const [event, setEvent] = useState<EventDetails | undefined>(() => getCacheSync("events", eventId)?.data);
    const backgroundStyle = useThemeBackground("background");

    const handleToggleHidden = useCallback((updatedEvent: EventDetails) => {
        saveCache("events", eventId, updatedEvent);
        setEvent(updatedEvent);
    }, [eventId, saveCache]);

    // Get update note. Latch so it's displayed even if reset in background.
    const updated = useUpdateSinceNote(event);
    const showUpdated = useLatchTrue(updated);

    return (
        <ScrollView 
            style={[StyleSheet.absoluteFill, backgroundStyle]} 
            stickyHeaderIndices={[0]} 
            stickyHeaderHiddenOnScroll
        >
            <Header secondaryIcon={platformShareIcon} secondaryPress={() => event && shareEvent(event)}>
                {event?.Title ?? t("viewing_event")}
            </Header>
            <Floater contentStyle={appStyles.trailer}>
                {!event ? null : (
                    <EventContent 
                        event={event} 
                        parentPad={padFloater} 
                        updated={showUpdated} 
                        onToggleHidden={handleToggleHidden}
                    />
                )}
            </Floater>
        </ScrollView>
    );
}
