import type { ParamListBase, TabNavigationState } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import type {
    MaterialTopTabNavigationOptions,
    MaterialTopTabNavigationEventMap
} from "@react-navigation/material-top-tabs";
import { withLayoutContext } from "expo-router";
import { TabBar } from "react-native-tab-view";
import * as React from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { TabLabel } from "@/components/generic/atoms/TabLabel";
import { useThemeBackground } from "@/hooks/themes/useThemeHooks";

const { Navigator } = createMaterialTopTabNavigator();

export const MaterialTopTabs = withLayoutContext<
    MaterialTopTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<ParamListBase>,
    MaterialTopTabNavigationEventMap
>(Navigator);

export default function DealersLayout() {

    const layout = useWindowDimensions();

    const sceneStyle = useThemeBackground("surface");
    const tabBarStyle = useThemeBackground("background");
    const indicatorStyle = useThemeBackground("secondary");

    return <MaterialTopTabs
        style={StyleSheet.absoluteFill}
        screenOptions={{ sceneStyle: sceneStyle }}
        tabBar={props =>
            <TabBar
                {...props}
                key="tabbar"
                navigationState={{ routes: props.state.routes, index: props.state.index }}
                renderLabel={({ focused, route }) => <TabLabel focused={focused}>{props.descriptors[route.key].options.title}</TabLabel>}
                style={tabBarStyle}
                indicatorStyle={indicatorStyle}
                tabStyle={{ width: layout.width / props.state.routes.length }}
            />}>
        <MaterialTopTabs.Screen name="personal" options={{ title: "Faves" }} />
        <MaterialTopTabs.Screen name="all" options={{ title: "All" }} />
        <MaterialTopTabs.Screen name="regular" options={{ title: "Regular" }} />
        <MaterialTopTabs.Screen name="ad" options={{ title: "AD" }} />
        <MaterialTopTabs.Screen name="az" options={{ title: "A-Z" }} />
    </MaterialTopTabs>;
}
