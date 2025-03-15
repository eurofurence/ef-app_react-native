import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, useIsFocused } from "@react-navigation/core";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { EventsSectionedList } from "../../components/events/EventsSectionedList";
import { Label } from "../../components/generic/atoms/Label";
import { useNow } from "../../hooks/time/useNow";
import { useAppSelector } from "../../store";
import { selectEventsByTrack } from "../../store/eurofurence/selectors/events";
import { eventTracksSelectors } from "../../store/eurofurence/selectors/records";
import { AreasRouterParamsList } from "../AreasRouter";
import { IndexRouterParamsList } from "../IndexRouter";
import { useZoneAbbr } from "../../hooks/time/useZoneAbbr";
import { useEventsRouterContext } from "./EventsRouterContext";
import { EventsRouterParamsList } from "./EventsRouter";
import { useEventOtherGroups } from "./Events.common";

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
    const isFocused = useIsFocused();
    const now = useNow(isFocused ? 5 : "static");

    const { setSelected } = useEventsRouterContext();

    // Use all events in track and group generically.
    const zone = useZoneAbbr();
    const track = useAppSelector((state) => eventTracksSelectors.selectById(state, route.name));
    const eventsInTrack = useAppSelector((state) => selectEventsByTrack(state, track?.Id ?? ""));
    const eventsGroups = useEventOtherGroups(t, now, zone, eventsInTrack);

    return (
        <EventsSectionedList
            navigation={navigation}
            eventsGroups={eventsGroups}
            select={setSelected}
            leader={
                <Label type="lead" variant="middle" mt={30}>
                    {track?.Name ?? ""}
                </Label>
            }
            cardType="time"
        />
    );
};
