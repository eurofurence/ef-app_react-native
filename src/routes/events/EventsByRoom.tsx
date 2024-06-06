import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/core";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import { chain, partition, sortBy } from "lodash";
import moment from "moment";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { EventsRouterParamsList } from "./EventsRouter";
import { useEventsRouterContext } from "./EventsRouterContext";
import { eventInstanceForPassed, eventInstanceForNotPassed } from "../../components/app/events/EventCard";
import { eventSectionForDate, eventSectionForPassed, EventSectionProps } from "../../components/app/events/EventSection";
import { EventsSectionedList } from "../../components/app/events/EventsSectionedList";
import { IconNames } from "../../components/generic/atoms/Icon";
import { Label } from "../../components/generic/atoms/Label";
import { useNow } from "../../hooks/time/useNow";
import { useAppSelector } from "../../store";
import { eventRoomsSelectors, selectEventsByRoom } from "../../store/eurofurence.selectors";
import { AreasRouterParamsList } from "../AreasRouter";
import { IndexRouterParamsList } from "../IndexRouter";

/**
 * Params handled by the screen in route.
 */
export type EventsByRoomParams = object;

/**
 * The properties to the screen as a component. TODO: Unify and verify types.
 */
export type EventsByRoomProps =
    // Route carrying from events tabs screen at "Room", own navigation via own parameter list.
    CompositeScreenProps<
        MaterialTopTabScreenProps<EventsRouterParamsList, string>,
        MaterialTopTabScreenProps<EventsRouterParamsList> & BottomTabScreenProps<AreasRouterParamsList> & StackScreenProps<IndexRouterParamsList>
    >;

export const EventsByRoom: FC<EventsByRoomProps> = ({ navigation, route }) => {
    const { t } = useTranslation("Events");
    const [now] = useNow();

    const { setSelected } = useEventsRouterContext();

    // Get the room. Use it to resolve events to display.
    const room = useAppSelector((state) => eventRoomsSelectors.selectById(state, route.name));
    const eventsAll = useAppSelector((state) => selectEventsByRoom(state, room?.Id ?? ""));
    const eventsGroups = useMemo(() => {
        const [upcoming, passed] = partition(eventsAll, (it) => now.isBefore(it.EndDateTimeUtc));
        return chain(upcoming)
            .orderBy("StartDateTimeUtc")
            .groupBy((event) => event.ConferenceDay?.Date)
            .flatMap((events, date) => [
                // Header.
                eventSectionForDate(t, date, events.length),
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
                    {room?.Name ?? ""}
                </Label>
            }
            cardType="time"
        />
    );
};
