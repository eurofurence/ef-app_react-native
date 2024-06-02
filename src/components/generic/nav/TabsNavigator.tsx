import { CommonActions } from "@react-navigation/core";
import { createNavigatorFactory, NavigationProp, ParamListBase, RouteProp, TabActionHelpers, TabNavigationState, TabRouter, useNavigationBuilder } from "@react-navigation/native";
import { FC, ReactNode, RefObject, useRef } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { IconNames } from "../atoms/Icon";
import { Tabs, TabsRef } from "../containers/Tabs";

/**
 * Options for a tabs-screen.
 */
export type TabNavigationOptions = {
    /**
     * The icon to use.
     */
    icon: IconNames;

    /**
     * The title of the screen.
     */
    title: string;

    /**
     * True if this tab should indicate or a node of what it should indicate.
     */
    indicate?: boolean | ReactNode;
};

export type TabNavigatorProps = {
    /**
     * Render function for the content under more.
     */
    more?: ReactNode | ((tabs: RefObject<TabsRef>) => ReactNode);

    /**
     * Text to display for opening the menu.
     */
    textMore?: string;

    /**
     * Text to display for closing the menu.
     */
    textLess?: string;

    /**
     * True if the more tab should indicate or a node of what it should indicate.
     */
    indicateMore?: boolean | ReactNode;

    /**
     * Style of the content. This is the container around all pages.
     */
    contentStyle?: StyleProp<ViewStyle>;

    /**
     * Style of a tab. This is on the page's individual container.
     */
    tabsStyle?: StyleProp<ViewStyle>;

    /**
     * The initial route.
     */
    initialRouteName: string;

    /**
     * The screens.
     */
    children: ReactNode;

    /**
     * The default screen options.
     */
    screenOptions: TabNavigationOptions;
};

/**
 * Events handled by the tabs emitter.
 */
export type TabNavigationEventMap = {
    /**
     * A tab was pressed.
     */
    tabPress: {
        data: undefined;
        canPreventDefault: true;
    };
};

/**
 * Type of navigation when using a screen inside a tab navigator.
 */
export type TabNavigationProp<
    ParamList extends ParamListBase,
    RouteName extends keyof ParamList = keyof ParamList,
    NavigatorID extends string | undefined = undefined,
> = NavigationProp<ParamList, RouteName, NavigatorID, TabNavigationState<ParamList>, TabNavigationOptions, TabNavigationEventMap> & TabActionHelpers<ParamList>;

/**
 * Props to a tabs-screen.
 */
export type TabScreenProps<ParamList extends ParamListBase, RouteName extends keyof ParamList = keyof ParamList, NavigatorID extends string | undefined = undefined> = {
    navigation: TabNavigationProp<ParamList, RouteName, NavigatorID>;
    route: RouteProp<ParamList, RouteName>;
};

export const TabNavigator: FC<TabNavigatorProps> = ({
    more,
    indicateMore,
    textMore = "More",
    textLess = "Less",
    contentStyle,
    tabsStyle,
    initialRouteName,
    children,
    screenOptions,
}) => {
    // Make builder from passed arguments.
    const { state, navigation, descriptors, NavigationContent } = useNavigationBuilder(TabRouter, {
        children,
        screenOptions,
        initialRouteName,
    });

    // Wrapper for dispatching navigation on presses.
    const dispatchNavigateToRoute = (routeIndex: number) =>
        navigation.dispatch({
            ...CommonActions.navigate(state.routes[routeIndex]),
            target: state.key,
        });

    // Handle to tabs for closing on press.
    const tabs = useRef<TabsRef>(null);

    return (
        <NavigationContent>
            <View style={[styles.content, contentStyle]}>
                {/* Tabbed content. */}
                <View style={styles.tab}>{descriptors[state.routes[state.index].key].render()}</View>
            </View>

            {/* Tab bar. */}
            <Tabs
                style={tabsStyle}
                ref={tabs}
                textMore={textMore}
                textLess={textLess}
                indicateMore={indicateMore}
                tabs={state.routes.map((route, i) => ({
                    active: state.index === i,
                    icon: descriptors[route.key].options.icon,
                    text: descriptors[route.key].options.title,
                    onPress: () => {
                        dispatchNavigateToRoute(i);
                        tabs.current?.close();
                    },
                    indicate: descriptors[route.key].options.indicate,
                }))}
            >
                {typeof more === "function" ? more(tabs) : more}
            </Tabs>
        </NavigationContent>
    );
};

export const createTabNavigator = createNavigatorFactory(TabNavigator);

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    tab: {
        flex: 1,
    },
});
