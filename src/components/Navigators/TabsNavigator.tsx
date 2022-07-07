import { useNavigationBuilder, TabRouter, createNavigatorFactory } from "@react-navigation/native";
import { FC, ReactNode, useRef, MutableRefObject } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";

import { IconiconsNames } from "../../types/Ionicons";
import { Tabs, TabsRef } from "../Containers/Tabs";
import { navigateTab } from "./Common";

export interface TabNavigatorScreenOptions {
    icon: IconiconsNames;
    title: string;
    indicate?: boolean | ReactNode;
    indicateMore?: boolean | ReactNode;
    more?: ReactNode | ((tabs: MutableRefObject<TabsRef | undefined>) => ReactNode);
}

export interface TabNavigatorProps {
    contentStyle?: StyleProp<ViewStyle>;
    tabsStyle?: StyleProp<ViewStyle>;
    initialRouteName: string;
    children: ReactNode;
    screenOptions: TabNavigatorScreenOptions;
}

export const TabNavigator: FC<TabNavigatorProps> = ({ contentStyle, tabsStyle, initialRouteName, children, screenOptions }) => {
    // Make builder from passed arguments.
    const { state, navigation, descriptors, NavigationContent } = useNavigationBuilder(TabRouter, {
        children,
        screenOptions,
        initialRouteName,
    });

    const tabs = useRef<any>();

    // Get current options to render "more" content.
    const currentOptions = descriptors[state.routes[state.index].key].options;

    return (
        <NavigationContent>
            <View style={[styles.content, contentStyle]}>
                {/* Tabbed content. */}
                {state.routes.map((route, i) => (
                    <View key={route.key} style={styleForChild(state.index, i)}>
                        {descriptors[route.key].render()}
                    </View>
                ))}
            </View>

            {/* Tab bar. */}
            <Tabs
                style={tabsStyle}
                ref={tabs}
                indicateMore={currentOptions.indicateMore}
                tabs={state.routes.map((route, i) => ({
                    active: state.index === i,
                    icon: descriptors[route.key].options.icon,
                    text: descriptors[route.key].options.title || route.name,
                    onPress: () => navigateTab(navigation, route),
                    indicate: descriptors[route.key].options.indicate,
                }))}
            >
                {typeof currentOptions.more === "function" ? currentOptions.more(tabs) : currentOptions.more}
            </Tabs>
        </NavigationContent>
    );
};

export const createTabNavigator = createNavigatorFactory(TabNavigator);

const styles = StyleSheet.create({
    content: {
        flex: 1,
    },
    visible: {
        flex: 1,
        display: "flex",
    },
    hidden: {
        flex: 1,
        display: "none",
    },
});

const styleForChild = (index: number, i: number) => (index === i ? styles.visible : styles.hidden);
