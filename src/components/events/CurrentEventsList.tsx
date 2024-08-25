import { chain } from "lodash";
import { Moment } from "moment";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { EventCard, eventInstanceForAny } from "./EventCard";
import { useAppNavigation } from "../../hooks/nav/useAppNavigation";
import { useAppSelector } from "../../store";
import { filterCurrentEvents } from "../../store/eurofurence/selectors/events";
import { eventsSelector } from "../../store/eurofurence/selectors/records";
import { Section } from "../generic/atoms/Section";

export type CurrentEventListProps = {
    now: Moment;
};
export const CurrentEventList: FC<CurrentEventListProps> = ({ now }) => {
    const { t } = useTranslation("Events");

    const navigation = useAppNavigation("Areas");
    const all = useAppSelector(eventsSelector.selectAll);
    const events = useMemo(
        () =>
            // Sort by how much time of the event still left.
            chain(filterCurrentEvents(all, now))
                .filter((item) => !item.Hidden)
                .map((details) => eventInstanceForAny(details, now))
                .orderBy("progress", "asc")
                .value(),
        [all, now],
    );

    if (events.length === 0) {
        return null;
    }

    return (
        <>
            <Section title={t("current_title")} subtitle={t("current_subtitle")} icon="clock" />
            <View style={styles.condense}>
                {events.map((event) => (
                    <EventCard
                        key={event.details.Id}
                        event={event}
                        type="duration"
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
