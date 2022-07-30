import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { chain } from "lodash";
import { FC, memo, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Label } from "../../components/Atoms/Label";
import { PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { useAppSelector } from "../../store";
import { eventsSelectors } from "../../store/eurofurence.selectors";
import { EventDayRecord, PartOfDay } from "../../store/eurofurence.types";
import { IconNames } from "../../types/IconNames";
import { ScreenAreasParamsList } from "../ScreenAreas";
import { ScreenStartParamsList } from "../ScreenStart";
import { EventsSectionedListGeneric } from "./EventsSectionedListGeneric";
import { EventsTabsScreenParamsList } from "./EventsTabsScreen";

/**
 * Params handled by the screen in route.
 */
export type EventsListByDayScreenParams = {
    /**
     * The day that's events are listed.
     */
    day: EventDayRecord;
};

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

    // Get the day. Use it to resolve events to display.
    // TODO: @lukashaertel pls fix
    const day = "day" in route.params ? route.params?.day : null;
    const eventsByDay = useAppSelector((state) => eventsSelectors.selectEnrichedEvents(state, eventsSelectors.selectByDay(state, day?.Id ?? "")));
    const eventsGroups = useMemo(() => {
        return chain(eventsByDay)
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
    }, [t, eventsByDay]);

    return (
        <EventsSectionedListGeneric
            eventsGroups={eventsGroups}
            leader={
                <Label type="h1" variant="middle" mt={30}>
                    {day?.Name ?? ""}
                </Label>
            }
        />
    );
});
