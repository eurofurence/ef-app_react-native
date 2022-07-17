import { chain } from "lodash";
import moment from "moment";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Label } from "../../components/Atoms/Label";
import { useIsEventDone } from "../../hooks/useEventProperties";
import { useAppSelector } from "../../store";
import { eventsCompleteSelector } from "../../store/eurofurence.selectors";
import { EventRoomRecord } from "../../store/eurofurence.types";
import { IconNames } from "../../types/IconNames";
import { EventsListByDayScreenProps } from "./EventsListByDayScreen";
import { EventsSectionedListGeneric } from "./EventsSectionedListGeneric";

/**
 * Params handled by the screen in route.
 */
export type EventsListByRoomScreenParams = {
    /**
     * The room that's events are listed.
     */
    room: EventRoomRecord;
};

/**
 * The properties to the screen as a component. TODO: Unify and verify types.
 */
export type EventsListByRoomScreenProps = EventsListByDayScreenProps;

export const EventsListByRoomScreen: FC<EventsListByRoomScreenProps> = ({ navigation, route }) => {
    const { t } = useTranslation("Events");
    const isEventDone = useIsEventDone();

    // Get the room. Use it to resolve events to display.
    const room = "room" in route.params ? route.params?.room : null;
    const eventsByRoom = useAppSelector((state) => eventsCompleteSelector.selectByRoom(state, room?.Id ?? ""));
    const eventsGroups = useMemo(() => {
        const done = chain(eventsByRoom)
            .filter((event) => isEventDone(event))
            .orderBy(["StartDateTimeUtc", (event) => isEventDone(event)])
            .value();

        return chain(eventsByRoom)
            .filter((event) => !isEventDone(event))
            .orderBy("StartDateTimeUtc")
            .groupBy((event) => event.ConferenceDay.Date)
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
                      })
            )
            .value();
    }, [t, eventsByRoom, isEventDone]);

    return (
        <EventsSectionedListGeneric
            navigation={navigation}
            eventsGroups={eventsGroups}
            leader={
                <Label type="h1" variant="middle" mt={30}>
                    {room?.Name ?? ""}
                </Label>
            }
            cardType="time"
        />
    );
};
