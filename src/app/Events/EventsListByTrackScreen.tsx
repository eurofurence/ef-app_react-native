import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { chain } from "lodash";
import moment from "moment";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { useEventsTabsContext } from "./EventsTabsContext";
import { EventsTabsScreenParamsList } from "./EventsTabsScreen";
import { EventSectionProps } from "../../components/app/events/EventSection";
import { EventsSectionedListGeneric } from "../../components/app/events/EventsSectionedListGeneric";
import { IconNames } from "../../components/generic/atoms/Icon";
import { Label } from "../../components/generic/atoms/Label";
import { PagesScreenProps } from "../../components/generic/nav/PagesNavigator";
import { TabScreenProps } from "../../components/generic/nav/TabsNavigator";
import { useIsEventDone } from "../../hooks/events/useEventProperties";
import { useAppSelector } from "../../store";
import { eventTracksSelectors, selectEventsByTrack } from "../../store/eurofurence.selectors";
import { ScreenAreasParamsList } from "../ScreenAreas";
import { ScreenStartParamsList } from "../ScreenStart";

/**
 * Params handled by the screen in route.
 */
export type EventsListByTrackScreenParams = object;

/**
 * The properties to the screen as a component. TODO: Unify and verify types.
 */
export type EventsListByTrackScreenProps =
    // Route carrying from events tabs screen at "Track", own navigation via own parameter list.
    CompositeScreenProps<
        PagesScreenProps<EventsTabsScreenParamsList, string>,
        PagesScreenProps<EventsTabsScreenParamsList> & TabScreenProps<ScreenAreasParamsList> & StackScreenProps<ScreenStartParamsList>
    >;

export const EventsListByTrackScreen: FC<EventsListByTrackScreenProps> = ({ route }) => {
    const { t } = useTranslation("Events");
    const isEventDone = useIsEventDone();

    const { setSelected } = useEventsTabsContext();

    // Get the track. Use it to resolve events to display.
    const track = useAppSelector((state) => eventTracksSelectors.selectById(state, route.name));
    const eventsByTrack = useAppSelector((state) => selectEventsByTrack(state, track?.Id ?? ""));
    const eventsGroups = useMemo(() => {
        const done = chain(eventsByTrack)
            .filter((event) => isEventDone(event))
            .orderBy(["StartDateTimeUtc", (event) => isEventDone(event)])
            .value();

        return chain(eventsByTrack)
            .filter((event) => !isEventDone(event))
            .orderBy("StartDateTimeUtc")
            .groupBy((event) => event.ConferenceDay?.Date)
            .entries()
            .flatMap(([date, events]) => [
                {
                    title: moment(date).format("dddd"),
                    subtitle: t("events_count", { count: events.length }),
                    icon: "calendar-outline" as IconNames,
                } as EventSectionProps,
                ...events,
            ])
            .thru((chain) =>
                done.length === 0
                    ? chain
                    : chain.concat([
                          {
                              title: t("events_done"),
                              subtitle: t("events_count", { count: done.length }),
                              icon: "calendar-clock-outline" as IconNames,
                          } as EventSectionProps,
                          ...done,
                      ]),
            )
            .value();
    }, [t, eventsByTrack, isEventDone]);

    const leader = useMemo(() => {
        return (
            <Label type="h1" variant="middle" mt={30}>
                {track?.Name ?? ""}
            </Label>
        );
    }, [track]);

    return <EventsSectionedListGeneric eventsGroups={eventsGroups} select={setSelected} leader={leader} cardType="time" />;
};
