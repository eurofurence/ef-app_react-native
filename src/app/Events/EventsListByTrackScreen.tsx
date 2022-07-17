import { chain } from "lodash";
import moment from "moment";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Label } from "../../components/Atoms/Label";
import { useIsEventDone } from "../../hooks/useEventProperties";
import { useAppSelector } from "../../store";
import { eventsCompleteSelector } from "../../store/eurofurence.selectors";
import { EventTrackRecord } from "../../store/eurofurence.types";
import { IconNames } from "../../types/IconNames";
import { EventsListByDayScreenProps } from "./EventsListByDayScreen";
import { EventsSectionedListGeneric } from "./EventsSectionedListGeneric";

/**
 * Params handled by the screen in route.
 */
export type EventsListByTrackScreenParams = {
    /**
     * The track that's events are listed.
     */
    track: EventTrackRecord;
};

/**
 * The properties to the screen as a component. TODO: Unify and verify types.
 */
export type EventsListByTrackScreenProps = EventsListByDayScreenProps;

export const EventsListByTrackScreen: FC<EventsListByTrackScreenProps> = ({ navigation, route }) => {
    const { t } = useTranslation("Events");
    const isEventDone = useIsEventDone();

    // Get the track. Use it to resolve events to display.
    const track = "track" in route.params ? route.params?.track : null;
    const eventsByTrack = useAppSelector((state) => eventsCompleteSelector.selectByTrack(state, track?.Id ?? ""));
    const eventsGroups = useMemo(() => {
        const done = chain(eventsByTrack)
            .filter((event) => isEventDone(event))
            .orderBy(["StartDateTimeUtc", (event) => isEventDone(event)])
            .value();

        return chain(eventsByTrack)
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
    }, [t, eventsByTrack, isEventDone]);

    return (
        <EventsSectionedListGeneric
            navigation={navigation}
            eventsGroups={eventsGroups}
            leader={
                <Label type="h1" variant="middle" mt={30}>
                    {track?.Name ?? ""}
                </Label>
            }
            cardType="time"
        />
    );
};
