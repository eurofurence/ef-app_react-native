import { CommonActions } from "@react-navigation/core";
import { createNavigatorFactory, NavigationProp, ParamListBase, RouteProp, TabActionHelpers, TabNavigationState, TabRouter, useNavigationBuilder } from "@react-navigation/native";
import { FC, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { cancelAnimation, Easing, runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { IconNames } from "../Atoms/Icon";
import { Pages, PagesRef } from "../Containers/Pages";

/**
 * Options for a pages-screen.
 */
export type PagesNavigationOptions = {
    /**
     * True if this page should be highlighted.
     */
    highlight?: boolean;
    /**
     * The icon to use.
     */
    icon: IconNames;

    /**
     * The title of the screen.
     */
    title: string;

    /**
     * True if this screen should be prioritized.
     */
    prioritize?: boolean;
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
     * True if screens should be hidden when not viewed.
     */
    detach?: boolean;

    /**
     * The amount of vertical pan travel that is still allowed for swipe.
     */
    panSlack?: number;

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
    NavigatorID extends string | undefined = undefined,
> = NavigationProp<ParamList, RouteName, NavigatorID, TabNavigationState<ParamList>, PagesNavigationOptions, PagesNavigationEventMap> & TabActionHelpers<ParamList>;

/**
 * Props to a pages-screen.
 */
export type PagesScreenProps<ParamList extends ParamListBase, RouteName extends keyof ParamList = keyof ParamList, NavigatorID extends string | undefined = undefined> = {
    navigation: PagesNavigationProp<ParamList, RouteName, NavigatorID>;
    route: RouteProp<ParamList, RouteName>;
};

export const PagesNavigator: FC<PagesNavigatorProps> = ({ contentStyle, pagesStyle, initialRouteName, detach = true, panSlack = 15, children, screenOptions }) => {
    // Make builder from passed arguments.
    const { state, navigation, descriptors, NavigationContent } = useNavigationBuilder(TabRouter, {
        children,
        screenOptions,
        initialRouteName,
    });

    // Wrapper for dispatching navigation on presses and swipes.
    const dispatchNavigateToRoute = (routeIndex: number) => {
        navigation.dispatch({
            ...CommonActions.navigate(state.routes[routeIndex]),
            target: state.key,
        });
    };

    // Reference, used for scrolling to selected page in tabs.
    const pages = useRef<PagesRef>(null);

    // Width of the pages in total.
    const [width, setWidth] = useState(-1);
    const [viewing, setViewing] = useState(state.index);

    // Style for arranger's width, fitting all given pages.
    const arrangerWidth = useMemo<StyleProp<Animated.AnimateStyle<StyleProp<ViewStyle>>>>(() => ({ width: `${state.routes.length * 100}%` }), [state.routes.length]);

    // Target and offset used for differentially determining if set from navigation or set from pan or button press.
    const offset = useSharedValue(state.index);
    const start = useSharedValue(0);

    // React to state and current target.
    useEffect(() => {
        cancelAnimation(offset);
        offset.value = state.index;
    }, [offset, state.index]);

    // Convert translation into viewed page, which can be reacted to as a state.
    useAnimatedReaction(
        () => Math.max(0, Math.min(Math.round(offset.value), state.routes.length - 1)),
        (index) => runOnJS(setViewing)(index),
        [navigation, offset, state.routes.length],
    );

    // React to viewed page change by scrolling to the page in the top tabs.
    useEffect(() => {
        pages.current?.scrollTo(viewing);
    }, [pages, viewing]);

    // Style that translates the arranger, so it shows the page.
    const translation = useAnimatedStyle(
        () => ({
            transform: [{ translateX: -width * offset.value }],
        }),
        [width, offset],
    );

    // Swipe page gesture.
    const gesture = Gesture.Pan()
        .activeOffsetX([-panSlack, panSlack])
        .onBegin(() => {
            start.value = offset.value;
            cancelAnimation(offset);
        })
        .onUpdate((e) => {
            // Update from translation.
            offset.value = Math.max(0, Math.min(-e.translationX / width + start.value, state.routes.length - 1));
        })
        .onEnd((e) => {
            const shift = e.translationX > 0 ? -0.4 : 0.4;
            const index = Math.max(0, Math.min(Math.round(offset.value + shift), state.routes.length - 1));

            // Animate to the end position. If able to finish, sync navigation.
            offset.value = withTiming(index, { duration: 234, easing: Easing.out(Easing.cubic) }, (finished) => {
                if (finished) {
                    runOnJS(dispatchNavigateToRoute)(offset.value);
                }
            });
        });

    return (
        <NavigationContent>
            {/* Page bar. */}
            <Pages
                ref={pages}
                style={pagesStyle}
                indicatorIndex={offset}
                pages={state.routes.map((route, i) => ({
                    active: viewing === i,
                    highlight: descriptors[route.key].options.highlight,
                    icon: descriptors[route.key].options.icon,
                    text: descriptors[route.key].options.title,
                    onPress: () => {
                        offset.value = i;
                        dispatchNavigateToRoute(i);
                    },
                }))}
            />

            {/* Pages content. */}
            <View style={[styles.content, contentStyle]} onLayout={(e) => setWidth(e.nativeEvent.layout.width || width)}>
                <GestureDetector gesture={gesture}>
                    <Animated.View style={[styles.arranger, arrangerWidth, translation]}>
                        {state.routes.map((route, i) => (
                            <View key={route.key} style={styles.page}>
                                {shouldSkipChild(viewing, i, detach) ? null : descriptors[route.key].render()}
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
});

const shouldSkipChild = (index: number, i: number, detach: boolean) => {
    if (!detach) return false;
    switch (i) {
        case index - 1:
        case index:
        case index + 1:
            return false;
        default:
            return true;
    }
};
