import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { chain } from "lodash";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Label } from "../../components/Atoms/Label";
import { PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { useAppSelector } from "../../store";
import { eventsCompleteSelector } from "../../store/eurofurence.selectors";
import { EventDayRecord, PartOfDay } from "../../store/eurofurence.types";
import { IconNames } from "../../types/IconNames";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";
import { EventsSectionedListGeneric } from "./EventsSectionedListGeneric";
import { EventsTabsScreenNavigatorParamsList } from "./EventsTabsScreen";

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
export type EventsListByDayScreenProps = CompositeScreenProps<PagesScreenProps<EventsTabsScreenNavigatorParamsList, any>, StackScreenProps<ScreenStartNavigatorParamsList>>;

export const EventsListByDayScreen: FC<EventsListByDayScreenProps> = ({ navigation, route }) => {
    const { t } = useTranslation("Events");

    // Get the day. Use it to resolve events to display.
    const day = "day" in route.params ? route.params?.day : null;
    const eventsByDay = useAppSelector((state) => eventsCompleteSelector.selectByDay(state, day?.Id ?? ""));
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
            navigation={navigation}
            eventsGroups={eventsGroups}
            leader={
                <Label type="h1" variant="middle" mt={30}>
                    {day?.Name ?? ""}
                </Label>
            }
        />
    );
};
