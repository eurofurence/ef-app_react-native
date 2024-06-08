import { createBottomTabNavigator, BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs/src/types";
import { CompositeScreenProps } from "@react-navigation/core";
import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import React, { FC, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IndexRouterParamsList } from "./IndexRouter";
import { DealersRouter, DealersRouterParams } from "./dealers/DealersRouter";
import { EventsRouter, EventsRouterParams } from "./events/EventsRouter";
import { Home, HomeParams } from "./home/Home";
import { Tabs, TabsRef } from "../components/generic/containers/Tabs";
import { MainMenu } from "../components/mainmenu/MainMenu";

/**
 * Available routes.
 */
export type AreasRouterParamsList = {
    /**
     * Area home screen, should show announcements and personalized content.
     */
    Home: HomeParams;

    /**
     * Events list.
     */
    Events: EventsRouterParams;

    /**
     * Dealers list.
     */
    Dealers: DealersRouterParams;
};

/**
 * Create an instance of the tabs-navigator with the provided routes.
 */
export const Tab = createBottomTabNavigator<AreasRouterParamsList>();

/**
 * Params handled by the screen in route. Delegated parameters for the areas.
 */
export type AreasRouterParams = NavigatorScreenParams<AreasRouterParamsList>;

/**
 * The properties to the screen as a component. Delegated parameters for the areas. TODO: Verify.
 */
export type AreasRouterProps =
    // Route carrying from start screen at "Areas", navigation via own parameter list and parent.
    CompositeScreenProps<StackScreenProps<IndexRouterParamsList, "Areas">, BottomTabScreenProps<AreasRouterParamsList> & StackScreenProps<IndexRouterParamsList>>;

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

/**
 * This is the primary router for home, event, and dealers. Stack navigation is allowed by index router.
 *
 * Events and dealers both provide a nested navigator and therefore are wrapped in their respective routers.
 * @constructor
 */
export const AreasRouter: FC<AreasRouterProps> = () => {
    const { t } = useTranslation("Menu");
    return (
        <View style={StyleSheet.absoluteFill}>
            <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <AreasTabBar {...props} />}>
                <Tab.Screen name="Home" options={{ title: t("home"), icon: "home" } as any} component={Home} />
                <Tab.Screen name="Events" options={{ title: t("events"), icon: "calendar" } as any} component={EventsRouter} />
                <Tab.Screen name="Dealers" options={{ title: t("dealers"), icon: "cart-outline" } as any} component={DealersRouter} />
            </Tab.Navigator>
        </View>
    );
};
