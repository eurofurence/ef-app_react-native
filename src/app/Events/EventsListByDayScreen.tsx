import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { chain, partition } from "lodash";
import { FC, memo, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { EventsSectionedListGeneric } from "./EventsSectionedListGeneric";
import { useEventsTabsContext } from "./EventsTabsContext";
import { EventsTabsScreenParamsList } from "./EventsTabsScreen";
import { IconNames } from "../../components/Atoms/Icon";
import { Label } from "../../components/Atoms/Label";
import { PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { eventDaysSelectors, selectEventsByDay } from "../../store/eurofurence.selectors";
import { EventDetails, PartOfDay } from "../../store/eurofurence.types";
import { ScreenAreasParamsList } from "../ScreenAreas";
import { ScreenStartParamsList } from "../ScreenStart";

/**
 * Params handled by the screen in route.
 */
export type EventsListByDayScreenParams = object;

/**
 * The properties to the screen as a component.
 */
export type EventsListByDayScreenProps =
    // Route carrying from events tabs screen at "Day", own navigation via own parameter list.
    CompositeScreenProps<
        PagesScreenProps<EventsTabsScreenParamsList, string>,
        PagesScreenProps<EventsTabsScreenParamsList> & TabScreenProps<ScreenAreasParamsList> & StackScreenProps<ScreenStartParamsList>
    >;

export const EventsListByDayScreen: FC<EventsListByDayScreenProps> = memo(({ route }) => {
    const { t } = useTranslation("Events");
    const [now] = useNow();

    const { setSelected } = useEventsTabsContext();

    // Get the day. Use it to resolve events to display.
    // TODO: @lukashaertel pls fix
    const day = useAppSelector((state) => eventDaysSelectors.selectById(state, route.name));
    const eventsByDay: EventDetails[] = useAppSelector((state) => selectEventsByDay(state, day?.Id ?? ""));
    const eventsGroups = useMemo(() => {
        const [upcoming, passed] = partition(eventsByDay, (it) => (now.isSame(it.StartDateTimeUtc, "days") ? now.isBefore(it.EndDateTimeUtc) : true));

        const stillUpcomingSections = chain(upcoming)
            .orderBy("StartDateTimeUtc")
            .groupBy("PartOfDay")
            .entries()
            .map(([partOfDay, events]) => ({
                title: t(partOfDay as PartOfDay),
                subtitle: t("events_count", { count: events.length }),
                icon: ((partOfDay === "morning" && "weather-sunset-up") ||
                    (partOfDay === "afternoon" && "weather-sunny") ||
                    (partOfDay === "evening" && "weather-sunset-down") ||
                    (partOfDay === "night" && "weather-night") ||
                    "weather-sunny") as IconNames,
                data: events,
            }))
            .value();

        const passedSections =
            passed.length > 0
                ? [
                      {
                          title: t("finished"),
                          subtitle: t("events_count", { count: passed.length }),
                          icon: "history" as IconNames,
                          data: passed,
                      },
                  ]
                : [];

        return stillUpcomingSections.concat(...passedSections);
    }, [t, eventsByDay, now]);

    return (
        <EventsSectionedListGeneric
            eventsGroups={eventsGroups}
            select={setSelected}
            leader={
                <Label type="h1" variant="middle" mt={30}>
                    {day?.Name ?? ""}
                </Label>
            }
        />
    );
});
