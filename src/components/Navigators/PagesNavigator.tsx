import { useNavigationBuilder, TabRouter, createNavigatorFactory, ParamListBase, RouteProp, NavigationProp, TabNavigationState, TabActionHelpers } from "@react-navigation/native";
import { FC, ReactNode, MutableRefObject, useState, useEffect, useMemo } from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { quickCubicOut } from "../../consts/animations";
import { IoniconsNames } from "../../types/Ionicons";
import { Pages } from "../Containers/Pages";
import { TabsRef } from "../Containers/Tabs";
import { navigateTab } from "./Common";

export type PagesNavigationOptions = {
    icon: IoniconsNames;
    title: string;
    indicate?: boolean | ReactNode;
    indicateMore?: boolean | ReactNode;
    more?: ReactNode | ((tabs: MutableRefObject<TabsRef | undefined>) => ReactNode);
};

export type PagesNavigatorProps = {
    contentStyle?: StyleProp<ViewStyle>;
    pagesStyle?: StyleProp<ViewStyle>;
    initialRouteName: string;
    children: ReactNode;
    screenOptions: PagesNavigationOptions;
};

export type PagesNavigationEventMap = {
    tabPress: {
        data: undefined;
        canPreventDefault: true;
    };
};
export type PagesNavigationProp<
    ParamList extends ParamListBase,
    RouteName extends keyof ParamList = keyof ParamList,
    NavigatorID extends string | undefined = undefined
> = NavigationProp<ParamList, RouteName, NavigatorID, TabNavigationState<ParamList>, PagesNavigationOptions, PagesNavigationEventMap> & TabActionHelpers<ParamList>;

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
        offset.value = withTiming(state.index, { ...quickCubicOut });
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

            offset.value = withTiming(index, { ...quickCubicOut });
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
                    indicate: descriptors[route.key].options.indicate,
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
