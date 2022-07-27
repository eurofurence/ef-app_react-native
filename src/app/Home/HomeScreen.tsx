import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { FC, memo } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Section } from "../../components/Atoms/Section";
import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
import { conId } from "../../configuration";
import { useNow } from "../../hooks/useNow";
import { useAppSelector } from "../../store";
import { eventDaysSelectors } from "../../store/eurofurence.selectors";
import { AnnouncementList } from "../Announcements/AnnouncementList";
import { CurrentEventList } from "../Events/CurrentEventsList";
import { UpcomingEventsList } from "../Events/UpcomingEventsList";
import { UpcomingFavoriteEventsList } from "../Events/UpcomingFavoriteEventsList";
import { ScreenAreasParamsList } from "../ScreenAreas";
import { ScreenStartParamsList } from "../ScreenStart";
import { CountdownHeader } from "./CountdownHeader";
import { DeviceSpecificWarnings } from "./DeviceSpecificWarnings";

/**
 * Params handled by the screen in route, nothing so far.
 */
export type ScreenHomeParams = undefined;

/**
 * The properties to the screen as a component.
 */
export type ScreenHomeProps = CompositeScreenProps<TabScreenProps<ScreenAreasParamsList, "Home">, StackScreenProps<ScreenStartParamsList>>;

export const HomeScreen: FC<ScreenHomeProps> = memo(() => {
    const [now] = useNow();

    const subtitle = useAppSelector((state) => eventDaysSelectors.selectCountdownTitle(state, now));

    return (
        <ScrollView>
            <CountdownHeader />

            <View
                style={{
                    width: 600,
                    maxWidth: "100%",
                    paddingHorizontal: 30,
                }}
            >
                <Section title={conId} icon={"alarm"} subtitle={subtitle} />
                <DeviceSpecificWarnings />
                <AnnouncementList />
                <CurrentEventList />
                <UpcomingEventsList />
                <UpcomingFavoriteEventsList />
            </View>
        </ScrollView>
    );
});
