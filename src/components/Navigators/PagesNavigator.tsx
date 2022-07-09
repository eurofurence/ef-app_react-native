import { useNavigationBuilder, TabRouter, createNavigatorFactory, ParamListBase, RouteProp, NavigationProp, TabNavigationState, TabActionHelpers } from "@react-navigation/native";
import { FC, ReactNode, useState, useEffect, useMemo } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { IoniconsNames } from "../../types/Ionicons";
import { Pages } from "../Containers/Pages";
import { navigateTab } from "./Common";

/**
 * Options for a pages-screen.
 */
export type PagesNavigationOptions = {
    /**
     * The icon to use.
     */
    icon: IoniconsNames;

    /**
     * The title of the screen.
     */
    title: string;
};

/**
 * Props to the pages navigator.
 */
export type PagesNavigatorProps = {
    /**
     * Style of the content. This is the container around all pages.
     */
    contentStyle?: StyleProp<ViewStyle>;

    /**
     * Style of a page. This is on the page's individual container.
     */
    pagesStyle?: StyleProp<ViewStyle>;

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
    screenOptions: PagesNavigationOptions;
};

/**
 * Events handled by the pages emitter.
 */
export type PagesNavigationEventMap = {
    /**
     * A page was pressed.
     */
    tabPress: {
        data: undefined;
        canPreventDefault: true;
    };
};

/**
 * Type of navigation when using a screen inside a pages navigator.
 */
export type PagesNavigationProp<
    ParamList extends ParamListBase,
    RouteName extends keyof ParamList = keyof ParamList,
    NavigatorID extends string | undefined = undefined
> = NavigationProp<ParamList, RouteName, NavigatorID, TabNavigationState<ParamList>, PagesNavigationOptions, PagesNavigationEventMap> & TabActionHelpers<ParamList>;

/**
 * Props to a pages-screen.
 */
export type PagesScreenProps<ParamList extends ParamListBase, RouteName extends keyof ParamList = keyof ParamList, NavigatorID extends string | undefined = undefined> = {
    navigation: PagesNavigationProp<ParamList, RouteName, NavigatorID>;
    route: RouteProp<ParamList, RouteName>;
};

export const PagesNavigator: FC<PagesNavigatorProps> = ({ contentStyle, pagesStyle, initialRouteName, children, screenOptions }) => {
    // Make builder from passed arguments.
    const { state, navigation, descriptors, NavigationContent } = useNavigationBuilder(TabRouter, {
        children,
        screenOptions,
        initialRouteName,
    });

    const [width, setWidth] = useState(-1);

    const arrangerWidth = useMemo(() => ({ width: `${state.routes.length * 100}%` }), [state.routes.length]);

    const start = useSharedValue(0);
    const offset = useSharedValue(0);

    useEffect(() => {
        offset.value = withTiming(state.index, { duration: 234, easing: Easing.out(Easing.cubic) });
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
                runOnJS(navigateTab)(navigation, index);
            }
        })
        .onEnd((e) => {
            const shift = e.translationX > 0 ? -0.4 : 0.4;
            let index = Math.round(offset.value + shift);
            index = Math.max(0, Math.min(index, state.routes.length - 1));

            offset.value = withTiming(index, { duration: 234, easing: Easing.out(Easing.cubic) });
            if (index !== state.index) {
                runOnJS(navigateTab)(navigation, index);
            }
        });

    return (
        <NavigationContent>
            {/* Page bar. */}
            <Pages
                style={pagesStyle}
                pages={state.routes.map((route, i) => ({
                    active: state.index === i,
                    icon: descriptors[route.key].options.icon,
                    text: descriptors[route.key].options.title || route.name,
                    onPress: () => navigateTab(navigation, route),
                }))}
            />

            {/* Pages content. */}
            <View style={[styles.content, contentStyle]} onLayout={(e) => setWidth(e.nativeEvent.layout.width || width)}>
                <GestureDetector gesture={gesture}>
                    <Animated.View style={[styles.arranger, arrangerWidth, translation]}>
                        {state.routes.map((route, i) => (
                            <View key={route.key} style={styles.page}>
                                <View style={styleForChild(state.index, i)}>{descriptors[route.key].render()}</View>
                            </View>
                        ))}
                    </Animated.View>
                </GestureDetector>
            </View>
        </NavigationContent>
    );
};

export const createPagesNavigator = createNavigatorFactory(PagesNavigator);

const styles = StyleSheet.create({
    content: {
        flex: 1,
        overflow: "hidden",
    },
    arranger: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        flexDirection: "row",
        alignItems: "stretch",
    },
    page: {
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

const styleForChild = (index: number, i: number) => {
    switch (i) {
        case index - 1:
        case index:
        case index + 1:
            return styles.visible;
        default:
            return styles.hidden;
    }
};
