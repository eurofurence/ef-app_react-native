import { useNavigationBuilder, TabRouter, TabActions, createNavigatorFactory } from "@react-navigation/native";
import { FC, ReactNode, useCallback, MutableRefObject, useState, useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { quickCubicOut } from "../../consts/animations";
import { IconiconsNames } from "../../types/Ionicons";
import { Pages } from "../Containers/Pages";
import { TabsRef } from "../Containers/Tabs";

const displayFor = (index: number, i: number) => {
    switch (i) {
        case index - 1:
            return "flex";
        case index:
            return "flex";
        case index + 1:
            return "flex";
        default:
            return "none";
    }
};

export interface PagedNavigatorScreenOptions {
    icon: IconiconsNames;
    title: string;
    indicate?: boolean | ReactNode;
    indicateMore?: boolean | ReactNode;
    more?: ReactNode | ((tabs: MutableRefObject<TabsRef | undefined>) => ReactNode);
}

export interface PagedNavigatorProps {
    initialRouteName: string;
    children: ReactNode;
    screenOptions: PagedNavigatorScreenOptions;
}

export const PagedNavigator: FC<PagedNavigatorProps> = ({ initialRouteName, children, screenOptions }) => {
    // Make builder from passed arguments.
    const { state, navigation, descriptors, NavigationContent } = useNavigationBuilder(TabRouter, {
        children,
        screenOptions,
        initialRouteName,
    });

    const [width, setWidth] = useState(400);

    const performIndexNavigation = useCallback(
        (index) => {
            const route = state.routes.at(index);
            if (!route) return;
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
        [state, navigation]
    );

    const performRouteNavigation = useCallback(
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

    const pagesStyle = useMemo(() => ({ width: state.routes.length * width }), [state.routes.length, width]);
    const pageStyle = useMemo(() => ({ width }), [width]);

    const start = useSharedValue(0);
    const offset = useSharedValue(0);

    useEffect(() => {
        offset.value = withTiming(state.index, quickCubicOut);
    }, [offset, state.index]);

    const translation = useAnimatedStyle(
        () => ({
            transform: [{ translateX: -width * offset.value }],
        }),
        [width, offset]
    );

    const gesture = Gesture.Pan()
        .onBegin(() => {
            start.value = offset.value;
        })
        .onUpdate((e) => {
            // Update from translation.
            offset.value = -e.translationX / width + start.value;
            offset.value = Math.max(0, Math.min(offset.value, state.routes.length - 1));

            let index = Math.round(offset.value);
            index = Math.max(0, Math.min(index, state.routes.length - 1));
            if (index !== state.index) {
                runOnJS(performIndexNavigation)(index);
            }
        })
        .onEnd((e) => {
            const shift = e.translationX > 0 ? -0.4 : 0.4;
            let index = Math.round(offset.value + shift);
            index = Math.max(0, Math.min(index, state.routes.length - 1));

            offset.value = withTiming(index, quickCubicOut);
            if (index !== state.index) {
                runOnJS(performIndexNavigation)(index);
            }
        });

    return (
        <NavigationContent>
            {/* Page bar. */}
            <Pages
                pages={state.routes.map((route, i) => ({
                    active: state.index === i,
                    icon: descriptors[route.key].options.icon,
                    text: descriptors[route.key].options.title || route.name,
                    onPress: performRouteNavigation(route),
                    indicate: descriptors[route.key].options.indicate,
                }))}
            />

            {/* Pages content. */}
            <GestureDetector gesture={gesture}>
                <View style={styles.container} onLayout={(e) => setWidth(e.nativeEvent.layout.width || width)}>
                    <Animated.View style={[styles.pages, pagesStyle, translation]}>
                        {state.routes.map((route, i) => (
                            <View key={route.key} style={[pageStyle]}>
                                <View style={[{ display: displayFor(state.index, i) }, pageStyle]}>{descriptors[route.key].render()}</View>
                            </View>
                        ))}
                    </Animated.View>
                </View>
            </GestureDetector>
        </NavigationContent>
    );
};

export const createPagedNavigator = createNavigatorFactory(PagedNavigator);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: "hidden",
    },
    pages: {
        flex: 1,
        flexDirection: "row",
    },
    page: {
        flex: 1,
    },
});
