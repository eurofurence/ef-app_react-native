import React, { useCallback, useMemo } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useDataCache } from "@/context/DataCacheProvider";
import { Label } from "@/components/generic/atoms/Label";
import { Floater } from "@/components/generic/containers/Floater";
import { EventCard, eventInstanceForAny } from "@/components/events/EventCard";
import { useNow } from "@/hooks/time/useNow";
import { EventDetails } from "@/store/eurofurence/types";
import { useZoneAbbr } from "@/hooks/time/useZoneAbbr";
import { useThemeBackground } from "@/hooks/themes/useThemeHooks";

export default function RevealHiddenPage() {
    const { t } = useTranslation("RevealHidden");
    const { getAllCacheSync, saveCache } = useDataCache();
    const now = useNow(5000); // Update every 5 seconds when focused
    const zone = useZoneAbbr();
    const backgroundStyle = useThemeBackground("background");

    // Get all events from cache
    const allEvents = getAllCacheSync("events");

    // Filter hidden events and create event instances
    const hiddenEvents = useMemo(
        () => allEvents.filter((item) => (item.data as EventDetails).Hidden).map((item) => eventInstanceForAny(item.data as EventDetails, now, zone)),
        [allEvents, now, zone],
    );

    // Handle unhiding an event
    const handleUnhide = useCallback(
        (eventId: string) => {
            const event = allEvents.find((e) => (e.data as EventDetails).Id === eventId);
            if (event) {
                const updatedEvent: EventDetails = {
                    ...(event.data as EventDetails),
                    Hidden: false,
                };
                saveCache("events", eventId, updatedEvent);
            }
        },
        [allEvents, saveCache],
    );

    return (
        <>
            <ScrollView style={[StyleSheet.absoluteFill, backgroundStyle]} className="flex-1">
                <Floater contentStyle={{ marginBottom: 16 }}>
                    <Label type="lead" variant="middle" style={{ marginTop: 30 }}>
                        {t("lead")}
                    </Label>

                    {hiddenEvents.map((item) => (
                        <EventCard key={item.details.Id} event={item} type="time" onPress={() => handleUnhide(item.details.Id)} />
                    ))}
                </Floater>
            </ScrollView>
        </>
    );
}
