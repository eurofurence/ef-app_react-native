import { Moment } from "moment/moment";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { useAppNavigation } from "../../hooks/nav/useAppNavigation";
import { useAppSelector } from "../../store";
import { filterUpcomingEvents } from "../../store/eurofurence/selectors/events";
import { eventsSelector } from "../../store/eurofurence/selectors/records";
import { Section } from "../generic/atoms/Section";
import { useZoneAbbr } from "../../hooks/time/useZoneAbbr";
import { EventCard, eventInstanceForAny } from "./EventCard";

export type UpcomingEventsListProps = {
    now: Moment;
};
export const UpcomingEventsList: FC<UpcomingEventsListProps> = ({ now }) => {
    const navigation = useAppNavigation("Areas");

    const { t } = useTranslation("Events");

    const zone = useZoneAbbr();
    const all = useAppSelector(eventsSelector.selectAll);
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
                            navigation.navigate("Event", {
                                id: event.Id,
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
