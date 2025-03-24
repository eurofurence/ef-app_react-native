import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { filterHappeningTodayEvents } from "../../store/eurofurence/selectors/events";
import { Section } from "../generic/atoms/Section";
import { useZoneAbbr } from "../../hooks/time/useZoneAbbr";
import { EventCard, eventInstanceForAny } from "./EventCard";
import React from "react";
import { router } from "expo-router";
import { useDataCache } from "../../context/DataCacheProvider";

export type TodayScheduleListProps = {
    now: Date;
};

export const TodayScheduleList: FC<TodayScheduleListProps> = ({ now }) => {
    const { t } = useTranslation("Events");
    const { getAllCacheSync } = useDataCache();
    const zone = useZoneAbbr();

    const events = useMemo(() => {
        const allEvents = getAllCacheSync("events").map(item => item.data);
        const favorites = allEvents.filter(event => event.Favorite && !event.Hidden);
        
        return filterHappeningTodayEvents(favorites, now)
            .map((details) => eventInstanceForAny(details, now, zone));
    }, [getAllCacheSync, now, zone]);

    if (events.length === 0) {
        return null;
    }

    return (
        <>
            <Section title={t("today_schedule_title")} subtitle={t("today_schedule_subtitle")} icon="book-marker" />
            <View style={styles.condense}>
                {events.map((event) => (
                    <EventCard
                        key={event.details.Id}
                        event={event}
                        type="time"
                        onPress={(event) =>
                            router.navigate({
                                pathname: "/events/[eventId]",
                                params: { eventId: event.Id },
                            })
                        }
                    />
                ))}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    condense: {
        marginVertical: -15,
    },
});
