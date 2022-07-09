import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { FC, RefObject, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TabsRef } from "../components/Containers/Tabs";
import { createTabNavigator } from "../components/Navigators/TabsNavigator";
import { ScreenEmpty, ScreenEmptyParams } from "./Common/ScreenEmpty";
import { ScreenEventsParams, ScreenEvents } from "./Events/ScreenEvents";
import { ScreenHome, ScreenHomeParams } from "./Home/ScreenHome";
import { MainMenu } from "./MainMenu/MainMenu";
import { ScreenStartNavigatorParamsList } from "./ScreenStart";

export type ScreenAreasNavigatorParamsList = {
    Home: ScreenHomeParams;
    Events: ScreenEventsParams;
    Dealers: ScreenEmptyParams;
};

export const AreasNavigator = createTabNavigator<ScreenAreasNavigatorParamsList>();

export type ScreenAreasParams = NavigatorScreenParams<ScreenAreasNavigatorParamsList>;

export type ScreenAreasProps = StackScreenProps<ScreenStartNavigatorParamsList>;

export const ScreenAreas: FC<ScreenAreasProps> = () => {
    const bottom = useSafeAreaInsets()?.bottom;
    const tabsStyle = useMemo(() => ({ paddingBottom: Math.max(bottom, 30) }), [bottom]);
    return (
        <View style={StyleSheet.absoluteFill}>
            <AreasNavigator.Navigator tabsStyle={tabsStyle} more={(tabs: RefObject<TabsRef>) => <MainMenu tabs={tabs} />}>
                <AreasNavigator.Screen name="Home" options={{ icon: "home" }} component={ScreenHome} />
                <AreasNavigator.Screen name="Events" options={{ icon: "calendar" }} component={ScreenEvents} />
                <AreasNavigator.Screen name="Dealers" options={{ icon: "cart-outline" }} component={ScreenEmpty} />
            </AreasNavigator.Navigator>
        </View>
    );
};
