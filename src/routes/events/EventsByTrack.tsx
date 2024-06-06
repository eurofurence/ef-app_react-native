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
import { eventSectionForDate, eventSectionForPassed } from "../../components/app/events/EventSection";
import { EventsSectionedList } from "../../components/app/events/EventsSectionedList";
import { Label } from "../../components/generic/atoms/Label";
import { useNow } from "../../hooks/time/useNow";
import { useAppSelector } from "../../store";
import { eventTracksSelectors, selectEventsByTrack } from "../../store/eurofurence.selectors";
import { AreasRouterParamsList } from "../AreasRouter";
import { IndexRouterParamsList } from "../IndexRouter";

/**
 * Params handled by the screen in route.
 */
export type EventsByTrackParams = object;

/**
 * The properties to the screen as a component. TODO: Unify and verify types.
 */
export type EventsByTrackProps =
    // Route carrying from events tabs screen at "Track", own navigation via own parameter list.
    CompositeScreenProps<
        MaterialTopTabScreenProps<EventsRouterParamsList, string>,
        MaterialTopTabScreenProps<EventsRouterParamsList> & BottomTabScreenProps<AreasRouterParamsList> & StackScreenProps<IndexRouterParamsList>
    >;

export const EventsByTrack: FC<EventsByTrackProps> = ({ navigation, route }) => {
    const { t } = useTranslation("Events");
    const [now] = useNow();

    const { setSelected } = useEventsRouterContext();

    // Get the track. Use it to resolve events to display.
    const track = useAppSelector((state) => eventTracksSelectors.selectById(state, route.name));
    const eventsAll = useAppSelector((state) => selectEventsByTrack(state, track?.Id ?? ""));
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
                    {track?.Name ?? ""}
                </Label>
            }
            cardType="time"
        />
    );
};
