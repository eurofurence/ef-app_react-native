import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/core";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import { chain, partition, sortBy } from "lodash";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { EventsRouterParamsList } from "./EventsRouter";
import { eventInstanceForNotPassed, eventInstanceForPassed } from "../../components/events/EventCard";
import { eventSectionForDate, eventSectionForPassed } from "../../components/events/EventSection";
import { EventsSectionedList } from "../../components/events/EventsSectionedList";
import { Label } from "../../components/generic/atoms/Label";
import { useNow } from "../../hooks/time/useNow";
import { useAppSelector } from "../../store";
import { selectFavoriteEvents } from "../../store/eurofurence/selectors/events";
import { AreasRouterParamsList } from "../AreasRouter";
import { IndexRouterParamsList } from "../IndexRouter";

/**
 * Params handled by the screen in route.
 */
export type PersonalScheduleParams = undefined;

/**
 * The properties to the screen as a component.
 */
export type PersonalScheduleProps = CompositeScreenProps<
    MaterialTopTabScreenProps<EventsRouterParamsList, "Personal">,
    MaterialTopTabScreenProps<EventsRouterParamsList> & BottomTabScreenProps<AreasRouterParamsList> & StackScreenProps<IndexRouterParamsList>
>;

export const PersonalSchedule: FC<PersonalScheduleProps> = ({ navigation }) => {
    const { t } = useTranslation("Events");
    const now = useNow();
    const eventsAll = useAppSelector(selectFavoriteEvents);

    const sections = useMemo(() => {
        const [upcoming, passed] = partition(eventsAll, (it) => now.isBefore(it.EndDateTimeUtc));
        return chain(upcoming)
            .orderBy("StartDateTimeUtc")
            .groupBy((event) => event.ConferenceDay?.Date)
            .flatMap((items, day) => [
                // Header.
                eventSectionForDate(t, day),
                // Event instances.
                ...items.map((details) => eventInstanceForNotPassed(details, now)),
            ])
            .thru((current) =>
                passed.length === 0
                    ? current
                    : current.concat([
                          // Passed header.
                          eventSectionForPassed(t),
                          // Passed event instances.
                          ...sortBy(passed, "StartDateTimeUtc").map((details) => eventInstanceForPassed(details)),
                      ]),
            )
            .value();
    }, [t, eventsAll, now]);

    return (
        <EventsSectionedList
            navigation={navigation}
            eventsGroups={sections}
            cardType={"time"}
            leader={
                <Label type="lead" variant="middle" mt={30}>
                    {t("schedule_title")}
                </Label>
            }
            empty={
                <Label type="para" variant="middle" mt={30}>
                    {t("schedule_empty")}
                </Label>
            }
        />
    );
};
