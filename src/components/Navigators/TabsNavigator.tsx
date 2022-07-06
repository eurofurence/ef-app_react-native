import { useNavigationBuilder, TabRouter, TabActions, createNavigatorFactory } from "@react-navigation/native";
import { FC, ReactNode, useCallback, useRef, MutableRefObject } from "react";
import { View, StyleSheet } from "react-native";

import { IconiconsNames } from "../../types/Ionicons";
import { Tabs, TabsRef } from "../Containers/Tabs";

export interface TabNavigatorScreenOptions {
    icon: IconiconsNames;
    title: string;
    indicate?: boolean | ReactNode;
    indicateMore?: boolean | ReactNode;
    more?: ReactNode | ((tabs: MutableRefObject<TabsRef | undefined>) => ReactNode);
}

export interface TabNavigatorProps {
    initialRouteName: string;
    children: ReactNode;
    screenOptions: TabNavigatorScreenOptions;
}

export const TabNavigator: FC<TabNavigatorProps> = ({ initialRouteName, children, screenOptions }) => {
    // Make builder from passed arguments.
    const { state, navigation, descriptors, NavigationContent } = useNavigationBuilder(TabRouter, {
        children,
        screenOptions,
        initialRouteName,
    });

    const tabs = useRef<TabsRef>();

    const performNavigation = useCallback(
        (route) => () => {
            const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
            });

            if (!event.defaultPrevented) {
                navigation.dispatch({
                    ...TabActions.jumpTo(route.name),
                    target: state.key,
                });
            }
        },
        [navigation]
    );

    // Get current options to render "more" content.
    const currentOptions = descriptors[state.routes[state.index].key].options;

    return (
        <NavigationContent>
            {/* Tabbed content. */}
            {state.routes.map((route, i) => (
                <View key={route.key} style={[StyleSheet.absoluteFill, { display: i === state.index ? "flex" : "none" }]}>
                    {descriptors[route.key].render()}
                </View>
            ))}

            {/* Tab bar. */}
            <Tabs
                ref={tabs}
                indicateMore={currentOptions.indicateMore}
                tabs={state.routes.map((route, i) => ({
                    active: state.index === i,
                    icon: descriptors[route.key].options.icon,
                    text: descriptors[route.key].options.title || route.name,
                    onPress: performNavigation(route),
                    indicate: descriptors[route.key].options.indicate,
                }))}
            >
                {typeof currentOptions.more === "function" ? currentOptions.more(tabs) : currentOptions.more}
            </Tabs>
        </NavigationContent>
    );
};

export const createTabNavigator = createNavigatorFactory(TabNavigator);
