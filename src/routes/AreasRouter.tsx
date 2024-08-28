import { createBottomTabNavigator, BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs/src/types";
import { CompositeScreenProps } from "@react-navigation/core";
import { NavigatorScreenParams } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import React, { FC, ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Animated, { Easing, useSharedValue, withSequence, withTiming } from "react-native-reanimated";

import { IndexRouterParamsList } from "./IndexRouter";
import { DealersRouter, DealersRouterParams } from "./dealers/DealersRouter";
import { EventsRouter, EventsRouterParams } from "./events/EventsRouter";
import { Home, HomeParams } from "./home/Home";
import { Badge } from "../components/generic/containers/Badge";
import { Tabs, TabsRef } from "../components/generic/containers/Tabs";
import { MainMenu } from "../components/mainmenu/MainMenu";
import { useSynchronizer } from "../components/sync/SynchronizationProvider";
import { ToastMessage, useToastMessages } from "../context/ToastContext";

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
 * Displays a fading out toast on the tabs.
 * @param type The type of the toast.
 * @param content The content, may be a React node.
 * @param queued The queued and unmodified time.
 * @param lifetime The lifetime of this toast.
 * @constructor
 */
const TabsToast = ({ type, content, queued, lifetime }: Omit<ToastMessage, "id">) => {
    const [seenTime] = useState(Date.now);

    const badgeColor = (type === "error" && "notification") || (type === "warning" && "warning") || "primary";
    const opacity = useSharedValue(1);

    useEffect(() => {
        const remainingTime = lifetime - (seenTime - queued);
        opacity.value = withSequence(
            // Wait.
            withTiming(1, { duration: remainingTime }),
            // Fade out.
            withTiming(0, { duration: 1300, easing: Easing.in(Easing.cubic) }),
        );
    }, [seenTime, queued, lifetime]);

    return (
        <Animated.View style={{ opacity }}>
            <Badge unpad={0} textType="regular" badgeColor={badgeColor} textColor="white">
                {content}
            </Badge>
        </Animated.View>
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

    // Areas router is the tabs provider and therefore renders toast messages and
    // displays the current syncing status. Be aware that this does only display
    // on the primary area screens, not on detail pages.
    const toastMessages = useToastMessages();
    const { isSynchronizing } = useSynchronizer();

    return (
        <Tab.Navigator
            screenOptions={{ headerShown: false }}
            tabBar={(props) => (
                <AreasTabBar activity={isSynchronizing} notice={!toastMessages.length ? null : toastMessages.map((toast) => <TabsToast key={toast.id} {...toast} />)} {...props} />
            )}
        >
            <Tab.Screen name="Home" options={{ title: t("home"), icon: "home" } as any} component={Home} />
            <Tab.Screen name="Events" options={{ title: t("events"), icon: "calendar" } as any} component={EventsRouter} />
            <Tab.Screen name="Dealers" options={{ title: t("dealers"), icon: "cart-outline" } as any} component={DealersRouter} />
        </Tab.Navigator>
    );
};
