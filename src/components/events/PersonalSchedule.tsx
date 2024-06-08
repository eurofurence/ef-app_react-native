import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/core";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import { chain, partition, sortBy } from "lodash";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { eventInstanceForNotPassed, eventInstanceForPassed } from "./EventCard";
import { eventSectionForDate, eventSectionForPassed } from "./EventSection";
import { EventsSectionedList } from "./EventsSectionedList";
import { useNow } from "../../hooks/time/useNow";
import { AreasRouterParamsList } from "../../routes/AreasRouter";
import { IndexRouterParamsList } from "../../routes/IndexRouter";
import { EventsRouterParamsList } from "../../routes/events/EventsRouter";
import { useAppSelector } from "../../store";
import { selectFavoriteEvents } from "../../store/eurofurence.selectors";
import { Label } from "../generic/atoms/Label";

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
                eventSectionForDate(t, day, items.length),
                // Event instances.
                ...items.map((details) => eventInstanceForNotPassed(details, now)),
            ])
            .thru((current) =>
                passed.length === 0
                    ? current
                    : current.concat([
                          // Passed header.
                          eventSectionForPassed(t, passed.length),
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
                <Label type="h1" variant="middle" mt={30}>
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
