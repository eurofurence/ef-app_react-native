import { View, Text } from "react-native";

import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { eventsSelectors } from "../../store/eurofurence.selectors";

export const UpcomingEventsList = () => {
    const [now] = useNow();
    const events = useAppSelector((state) => eventsSelectors.selectUpcomingEvents(state, now));

    return (
        <View>
            <Text>Events</Text>
        </View>
    );
};
