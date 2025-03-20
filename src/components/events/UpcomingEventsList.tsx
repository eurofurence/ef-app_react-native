import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { filterUpcomingEvents } from "@/store/eurofurence/selectors/events";
import { Section } from "../generic/atoms/Section";
import { useZoneAbbr } from "@/hooks/time/useZoneAbbr";
import { EventCard, eventInstanceForAny } from "./EventCard";
import { useDataCache } from "@/context/DataCacheProvider";
import { EventDetails } from "@/store/eurofurence/types";
import { router } from "expo-router";

export type UpcomingEventsListProps = {
    now: Date;
};
export const UpcomingEventsList: FC<UpcomingEventsListProps> = ({ now }) => {
    const { t } = useTranslation("Events");
    const { getAllCacheSync } = useDataCache();

    const zone = useZoneAbbr();
    const all = getAllCacheSync<EventDetails>("events").map((item) => item.data);

    const events = useMemo(
        () =>
            filterUpcomingEvents(all, now)
                .filter((item) => !item.Hidden)
                .map((details) => eventInstanceForAny(details, now, zone)),
        [all, now, zone],
    );

    if (events.length === 0) {
        return null;
    }

    return (
        <>
            <Section title={t("upcoming_title")} subtitle={t("upcoming_subtitle")} icon="clock" />
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
