import { createBottomTabNavigator, BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs/src/types";
import { CompositeScreenProps } from "@react-navigation/core";
import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import React, { FC, RefObject, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenStartParamsList } from "./ScreenStart";
import { DealersTabsScreen, DealersTabsScreenParams } from "./dealers/DealersTabsScreen";
import { EventsTabsScreen, EventsTabsScreenParams } from "./events/EventsTabsScreen";
import { HomeScreen, ScreenHomeParams } from "./home/HomeScreen";
import { MainMenu } from "../components/app/mainmenu/MainMenu";
import { Tabs, TabsRef } from "../components/generic/containers/Tabs";

/**
 * Available routes.
 */
export type ScreenAreasParamsList = {
    /**
     * Area home screen, should show announcements and personalized content.
     */
    Home: ScreenHomeParams;

    /**
     * Events list.
     */
    Events: EventsTabsScreenParams;

    /**
     * Dealers list.
     */
    Dealers: DealersTabsScreenParams;
};

/**
 * Create an instance of the tabs-navigator with the provided routes.
 */
export const Tab = createBottomTabNavigator<ScreenAreasParamsList>();

/**
 * Params handled by the screen in route. Delegated parameters for the areas.
 */
export type ScreenAreasParams = NavigatorScreenParams<ScreenAreasParamsList>;

/**
 * The properties to the screen as a component. Delegated parameters for the areas. TODO: Verify.
 */
export type ScreenAreasProps =
    // Route carrying from start screen at "Areas", navigation via own parameter list and parent.
    CompositeScreenProps<StackScreenProps<ScreenStartParamsList, "Areas">, BottomTabScreenProps<ScreenAreasParamsList> & StackScreenProps<ScreenStartParamsList>>;

const AreasTabBar: FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
    const tabs = useRef<TabsRef>(null);
    const { t } = useTranslation("Menu");
    const bottom = useSafeAreaInsets()?.bottom;
    const tabsStyle = useMemo(() => ({ paddingBottom: Math.max(bottom, 30) }), [bottom]);

    return (
        <Tabs
            ref={tabs}
            style={tabsStyle}
            tabs={state.routes.map((route, i) => {
                const { options } = descriptors[route.key];

                const isFocused = state.index === i;
                return {
                    active: state.index === i,
                    icon: (options as any).icon,
                    text: options.title ?? route.name,
                    onPress: () => {
                        const event = navigation.emit({
                            type: "tabPress",
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                        tabs.current?.close();
                    },
                    indicate: (options as any).indicate,
                };
            })}
            textMore={t("more")}
            textLess={t("less")}
        >
            <MainMenu tabs={tabs} />
        </Tabs>
    );
};

export const ScreenAreas: FC<ScreenAreasProps> = () => {
    const { t } = useTranslation("Menu");
    // TODO: Screen styles, padding etc. verify.
    return (
        <View style={StyleSheet.absoluteFill}>
            <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <AreasTabBar {...props} />}>
                <Tab.Screen name="Home" options={{ title: t("home"), icon: "home" } as any} component={HomeScreen} />
                <Tab.Screen name="Events" options={{ title: t("events"), icon: "calendar" } as any} component={EventsTabsScreen} />
                <Tab.Screen name="Dealers" options={{ title: t("dealers"), icon: "cart-outline" } as any} component={DealersTabsScreen} />
            </Tab.Navigator>
        </View>
    );
};
