import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, useIsFocused } from "@react-navigation/core";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import { chain, partition, sortBy } from "lodash";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { EventsRouterParamsList } from "./EventsRouter";
import { useEventsRouterContext } from "./EventsRouterContext";
import { eventInstanceForPassed, eventInstanceForNotPassed } from "../../components/events/EventCard";
import { eventSectionForPassed, eventSectionForPartOfDay } from "../../components/events/EventSection";
import { EventsSectionedList } from "../../components/events/EventsSectionedList";
import { Label } from "../../components/generic/atoms/Label";
import { useNow } from "../../hooks/time/useNow";
import { useAppSelector } from "../../store";
import { eventDaysSelectors, selectEventsByDay } from "../../store/eurofurence.selectors";
import { EventDetails, PartOfDay } from "../../store/eurofurence.types";
import { AreasRouterParamsList } from "../AreasRouter";
import { IndexRouterParamsList } from "../IndexRouter";

/**
 * Params handled by the screen in route.
 */
export type EventsByDayParams = object;

/**
 * The properties to the screen as a component.
 */
export type EventsByDayProps =
    // Route carrying from events tabs screen at "Day", own navigation via own parameter list.
    CompositeScreenProps<
        MaterialTopTabScreenProps<EventsRouterParamsList, string>,
        MaterialTopTabScreenProps<EventsRouterParamsList> & BottomTabScreenProps<AreasRouterParamsList> & StackScreenProps<IndexRouterParamsList>
    >;

export const EventsByDay: FC<EventsByDayProps> = ({ navigation, route }) => {
    const { t } = useTranslation("Events");
    const isFocused = useIsFocused();
    const now = useNow(isFocused ? 5 : "static");

    const { setSelected } = useEventsRouterContext();

    // Get the day. Use it to resolve events to display.
    // TODO: @lukashaertel pls fix
    const day = useAppSelector((state) => eventDaysSelectors.selectById(state, route.name));
    const eventsAll: EventDetails[] = useAppSelector((state) => selectEventsByDay(state, day?.Id ?? ""));
    const eventsGroups = useMemo(() => {
        const [upcoming, passed] = partition(eventsAll, (it) => now.isBefore(it.EndDateTimeUtc));
        return chain(upcoming)
            .orderBy("StartDateTimeUtc")
            .groupBy("PartOfDay")
            .flatMap((events, partOfDay) => [
                // Header.
                eventSectionForPartOfDay(t, partOfDay as PartOfDay, events.length),
                // Event instances.
                ...events.map((details) => eventInstanceForNotPassed(details, now)),
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
            eventsGroups={eventsGroups}
            select={setSelected}
            leader={
                <Label type="h1" variant="middle" mt={30}>
                    {day?.Name ?? ""}
                </Label>
            }
        />
    );
};
