import { clone } from "lodash";
import moment from "moment";
import { FC, useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { createPagesNavigator } from "../../components/Navigators/PagesNavigator";
import { useGetEventDaysQuery } from "../../store/eurofurence.service";
import { EventsBrowserDayScreen } from "./EventsBrowseDayScreen";

const PagesNavigator = createPagesNavigator();

export const EventsBrowser: FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
    const days = useGetEventDaysQuery();

    const top = useSafeAreaInsets()?.top;
    const pagesStyle = useMemo(() => ({ paddingTop: top }), [top]);

    return !days.data?.length ? null : (
        <PagesNavigator.Navigator pagesStyle={pagesStyle}>
            {days.data.map((day) => (
                <PagesNavigator.Screen
                    key={day.Id}
                    name={day.Name as string}
                    component={EventsBrowserDayScreen}
                    options={{ title: moment(day.Date).format("ddd") }}
                    initialParams={{ day: clone(day) }}
                />
            ))}
        </PagesNavigator.Navigator>
    );
};
