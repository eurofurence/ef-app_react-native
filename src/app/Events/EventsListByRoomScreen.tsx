import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { chain } from "lodash";
import moment from "moment";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { EventsSectionedListGeneric } from "./EventsSectionedListGeneric";
import { useEventsTabsContext } from "./EventsTabsContext";
import { EventsTabsScreenParamsList } from "./EventsTabsScreen";
import { IconNames } from "../../components/Atoms/Icon";
import { Label } from "../../components/Atoms/Label";
import { PagesScreenProps } from "../../components/Navigators/PagesNavigator";
import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { useIsEventDone } from "../../hooks/useEventProperties";
import { useAppSelector } from "../../store";
import { eventRoomsSelectors, selectEventsByRoom } from "../../store/eurofurence.selectors";
import { ScreenAreasParamsList } from "../ScreenAreas";
import { ScreenStartParamsList } from "../ScreenStart";

/**
 * Params handled by the screen in route.
 */
export type EventsListByRoomScreenParams = object;

/**
 * The properties to the screen as a component. TODO: Unify and verify types.
 */
export type EventsListByRoomScreenProps =
    // Route carrying from events tabs screen at "Room", own navigation via own parameter list.
    CompositeScreenProps<
        PagesScreenProps<EventsTabsScreenParamsList, string>,
        PagesScreenProps<EventsTabsScreenParamsList> & TabScreenProps<ScreenAreasParamsList> & StackScreenProps<ScreenStartParamsList>
    >;

export const EventsListByRoomScreen: FC<EventsListByRoomScreenProps> = ({ route }) => {
    const { t } = useTranslation("Events");
    const isEventDone = useIsEventDone();

    const { setSelected } = useEventsTabsContext();

    // Get the room. Use it to resolve events to display.
    const room = useAppSelector((state) => eventRoomsSelectors.selectById(state, route.name));
    const eventsByRoom = useAppSelector((state) => selectEventsByRoom(state, room?.Id ?? ""));
    const eventsGroups = useMemo(() => {
        const done = chain(eventsByRoom)
            .filter((event) => isEventDone(event))
            .orderBy(["StartDateTimeUtc", (event) => isEventDone(event)])
            .value();

        return chain(eventsByRoom)
            .filter((event) => !isEventDone(event))
            .orderBy("StartDateTimeUtc")
            .groupBy((event) => event.ConferenceDay?.Date)
            .entries()
            .map(([date, events]) => ({
                title: moment(date).format("dddd"),
                subtitle: t("events_count", { count: events.length }),
                icon: "calendar-outline" as IconNames,
                data: events,
            }))
            .thru((chain) =>
                done.length === 0
                    ? chain
                    : chain.concat({
                          title: t("events_done"),
                          subtitle: t("events_count", { count: done.length }),
                          icon: "calendar-clock-outline" as IconNames,
                          data: done,
                      }),
            )
            .value();
    }, [t, eventsByRoom, isEventDone]);

    return (
        <EventsSectionedListGeneric
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
