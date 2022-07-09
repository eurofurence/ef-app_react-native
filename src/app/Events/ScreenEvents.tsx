import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { clone } from "lodash";
import moment from "moment";
import { FC, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { createPagesNavigator } from "../../components/Navigators/PagesNavigator";
import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { useGetEventDaysQuery } from "../../store/eurofurence.service";
import { ScreenAreasNavigatorParamsList } from "../ScreenAreas";
import { ScreenStartNavigatorParamsList } from "../ScreenStart";
import { ScreenEventsDay, ScreenEventsDayParams } from "./ScreenEventsDay";

// TODO: Might have an distinction between days, tracks, rooms as param.

export type EventsNavigatorParamsList = {
    [day: string]: ScreenEventsDayParams;
};

const EventsNavigator = createPagesNavigator<EventsNavigatorParamsList>();

export type ScreenEventsParams = undefined;

export type ScreenEventsProps = CompositeScreenProps<TabScreenProps<ScreenAreasNavigatorParamsList, "Events">, StackScreenProps<ScreenStartNavigatorParamsList>>;

export const ScreenEvents: FC<ScreenEventsProps> = () => {
    const days = useGetEventDaysQuery();

    const top = useSafeAreaInsets()?.top;
    const pagesStyle = useMemo(() => ({ paddingTop: top }), [top]);

    return !days.data?.length ? null : (
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
