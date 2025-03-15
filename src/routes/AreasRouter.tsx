import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs/src/types";
import React, { FC, ReactNode, useRef } from "react";
import { useTranslation } from "react-i18next";

import { Toast } from "@/components/Toast";
import { Tabs, TabsRef } from "@/components/generic/containers/Tabs";
import { MainMenu } from "../components/mainmenu/MainMenu";
import { useToastMessages } from "@/context/ToastContext";
import { Home, HomeParams } from "./home/Home";
import { EventsRouter, EventsRouterParams } from "./events/EventsRouter";
import { DealersRouter, DealersRouterParams } from "./dealers/DealersRouter";

/**
 * Minimum padding to use if safe area is less.
 */
const minSafeAreaPadding = 15;

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

type AreasTabBarProps = BottomTabBarProps & {
    /**
     * True if activity should be indicated.
     */
    activity?: boolean;

    /**
     * If given, a notice element on top of the tabs.
     */
    notice?: string | ReactNode;
};

const AreasTabBar: FC<AreasTabBarProps> = ({ state, descriptors, navigation, insets, activity, notice }) => {
    const tabs = useRef<TabsRef>(null);
    const { t } = useTranslation("Menu");
    return (
        <Tabs
            style={{ paddingBottom: Math.max(minSafeAreaPadding, insets.bottom) }}
            ref={tabs}
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
            activity={activity}
            notice={notice}
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
export const AreasRouter: FC = () => {
    const { t } = useTranslation("Menu");

    // Areas router is the tabs provider and therefore renders toast messages and
    // displays the current syncing status. Be aware that this does only display
    // on the primary area screens, not on detail pages.
    const toastMessages = useToastMessages(5);

    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false }}
            tabBar={(props) => (
                <AreasTabBar notice={!toastMessages.length ? null : [...toastMessages].reverse().map((toast) => <Toast key={toast.id} {...toast} loose={false} />)} {...props} />
            )}
        >
            <Tab.Screen name="Home" options={{ title: t("home"), icon: "home" } as any} component={Home} />
            <Tab.Screen name="Events" options={{ title: t("events"), icon: "calendar" } as any} component={EventsRouter} />
            <Tab.Screen name="Dealers" options={{ title: t("dealers"), icon: "cart-outline" } as any} component={DealersRouter} />
        </Tab.Navigator>
    );
};
