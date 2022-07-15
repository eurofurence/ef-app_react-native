import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { orderBy } from "lodash";
import moment from "moment";
import { FC, useMemo } from "react";

import { Section } from "../../components/Atoms/Section";
import { PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { eventsCompleteSelector } from "../../store/eurofurence.selectors";
import { EventDayRecord } from "../../store/eurofurence.types";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";
import { EventsSectionedListGeneric, EventsSectionedListItem } from "./EventsSectionedListGeneric";
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
    const [now] = useNow();

    // Get the day. Use it to resolve events to display.
    const day = "day" in route.params ? route.params?.day : null;
    const isToday = useMemo(() => now.isSame(day?.Date, "day"), [now, day]);
    const eventsByDay = useAppSelector((state) => eventsCompleteSelector.selectByDay(state, day?.Id ?? ""));
    const eventsGroups = useMemo(() => {
        const groups: EventsSectionedListItem[] = [];
        for (const event of orderBy(eventsByDay, "StartDateTimeUtc")) {
            let target = groups.length ? groups[groups.length - 1] : undefined;
            if (target?.timeUtc !== event.StartDateTimeUtc) {
                target = { timeUtc: event.StartDateTimeUtc, data: [] };
                groups.push(target);
            }
            target.data.push(event);
        }

        return groups;
    }, [eventsByDay]);
    return (
        <EventsSectionedListGeneric
            navigation={navigation}
            eventsGroups={eventsGroups}
            leader={
                <Section
                    title={day?.Name ?? ""}
                    subtitle={isToday ? `${eventsByDay.length} events today` : `${eventsByDay.length} events on ${moment(day?.Date).format("dddd")}`}
                />
            }
        />
    );
};
