import { FC, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { createTabNavigator } from "../components/Navigators/TabsNavigator";
import { NoScreen } from "./Common/NoScreen";
import { EventsBrowser } from "./Events/EventsBrowser";
import { HomeScreen } from "./Home/HomeScreen";
import { MainMenu } from "./MainMenu/MainMenu";

export const AreasNavigator = createTabNavigator();

export const AreasScreen: FC<{ navigation: any; route: any }> = ({ navigation, route }) => {
    const bottom = useSafeAreaInsets()?.bottom;
    const tabsStyle = useMemo(() => ({ paddingBottom: Math.max(bottom, 30) }), [bottom]);
    return (
        <View style={StyleSheet.absoluteFill}>
            <AreasNavigator.Navigator tabsStyle={tabsStyle} more={(tabs: any) => <MainMenu tabs={tabs} />}>
                <AreasNavigator.Screen name="Home" options={{ icon: "home" }} component={HomeScreen} />
                <AreasNavigator.Screen name="Events" options={{ icon: "calendar" }} component={EventsBrowser} />
                <AreasNavigator.Screen name="Dealers" options={{ icon: "cart-outline" }} component={NoScreen} />
            </AreasNavigator.Navigator>
        </View>
    );
};
