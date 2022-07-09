import { CompositeScreenProps } from "@react-navigation/core";
import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { clone } from "lodash";
import moment from "moment";
import { FC, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { createPagesNavigator } from "../../components/Navigators/PagesNavigator";
import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { useSignalLoading } from "../../context/LoadingContext";
import { useGetEventDaysQuery } from "../../store/eurofurence.service";
import { ScreenAreasNavigatorParamsList } from "../ScreenAreas";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";
import { ScreenEventsDay, ScreenEventsDayParams } from "./ScreenEventsDay";

// TODO: Might have an distinction between days, tracks, rooms as param.

/**
 * Available routes.
 */
export type EventsNavigatorParamsList = {
    /**
     * All names (days) want events-day parameters.
     */
    [day: string]: ScreenEventsDayParams;
};

/**
 * Create an instance of the pages-navigator with the provided routes.
 */
const EventsNavigator = createPagesNavigator<EventsNavigatorParamsList>();

/**
 * Params handled by the screen in route. Delegated parameters for the days. TODO: Verify.
 */
export type ScreenEventsParams = NavigatorScreenParams<EventsNavigatorParamsList>;

/**
 * The properties to the screen as a component.
 */
export type ScreenEventsProps = CompositeScreenProps<TabScreenProps<ScreenAreasNavigatorParamsList, "Events">, StackScreenProps<ScreenStartNavigatorParamsList>>;

export const ScreenEvents: FC<ScreenEventsProps> = () => {
    // Use event days.
    const days = useGetEventDaysQuery();

    // Signal if days are fetching.
    useSignalLoading(days.isFetching);

    // Compute the safe area.
    const top = useSafeAreaInsets()?.top;
    const pagesStyle = useMemo(() => ({ paddingTop: top }), [top]);

    // If no days, skip for now. TODO: Better loading content.
    if (!days.data?.length) return null;

    return (
        <EventsNavigator.Navigator pagesStyle={pagesStyle}>
            {days.data.map((day) => (
                <EventsNavigator.Screen
                    key={day.Id}
                    name={day.Name as string}
                    component={ScreenEventsDay}
                    options={{ title: moment(day.Date).format("ddd") }}
                    initialParams={{ day: clone(day) }}
                />
            ))}
        </EventsNavigator.Navigator>
    );
};
