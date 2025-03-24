import { useIsFocused } from "@react-navigation/core";
import { chain } from "lodash";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { appStyles } from "@/components/AppStyles";
import { EventCard, eventInstanceForAny } from "@/components/events/EventCard";
import { Label } from "@/components/generic/atoms/Label";
import { Floater } from "@/components/generic/containers/Floater";
import { Header } from "@/components/generic/containers/Header";
import { useNow } from "@/hooks/time/useNow";
import { useZoneAbbr } from "@/hooks/time/useZoneAbbr";
import { useDataCache } from "@/context/DataCacheProvider";
import { EventDetails } from "@/store/eurofurence/types";

export const RevealHidden = () => {
    const { t } = useTranslation("RevealHidden");
    const isFocused = useIsFocused();
    const now = useNow(isFocused ? 5 : "static");
    const zone = useZoneAbbr();
    const { getCacheSync, saveCache } = useDataCache();
    
    const settings = getCacheSync("settings", "settings")?.data ?? {
        cid: "",
        cacheVersion: "",
        lastSynchronised: "",
        state: {},
        lastViewTimes: {},
        hiddenEvents: [] as string[]
    };

    const allEventsCache = getCacheSync("events", "events");
    const allEvents = (allEventsCache?.data ?? []) as EventDetails[];
    
    const hidden = useMemo(
        () =>
            chain(allEvents)
                .filter((item: EventDetails) => Boolean(settings.hiddenEvents?.includes(item.Id)))
                .map((details) => eventInstanceForAny(details, now, zone))
                .value(),
        [allEvents, settings.hiddenEvents, now, zone],
    );

    const unhideEvent = (eventId: string) => {
        const newSettings = {
            ...settings,
            hiddenEvents: settings.hiddenEvents?.filter(id => id !== eventId) ?? []
        };
        saveCache("settings", "settings", newSettings);
    };

    return (
        <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Floater contentStyle={appStyles.trailer}>
                <Label type="lead" variant="middle" mt={30}>
                    {t("lead")}
                </Label>

                {hidden.map((item) => (
                    <EventCard key={item.details.Id} event={item} type="time" onPress={() => unhideEvent(item.details.Id)} />
                ))}
            </Floater>
        </ScrollView>
    );
}; 