import { CompositeScreenProps } from "@react-navigation/core";
import { StackScreenProps } from "@react-navigation/stack";
import { FC, memo } from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { TabScreenProps } from "../../components/Navigators/TabsNavigator";
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
    return (
        <ScrollView stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <CountdownHeader />

            <View
                style={{
                    width: 600,
                    maxWidth: "100%",
                    paddingHorizontal: 30,
                }}
            >
                <DeviceSpecificWarnings />
                <AnnouncementList />
                <CurrentEventList />
                <UpcomingEventsList />
                <UpcomingFavoriteEventsList />
            </View>
        </ScrollView>
    );
});
