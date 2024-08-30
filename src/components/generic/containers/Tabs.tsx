import { createContext, forwardRef, ReactNode, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { BackHandler, Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated, { cancelAnimation, Easing, runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";

import { Tab } from "./Tab";
import { useThemeBackground, useThemeBorder } from "../../../hooks/themes/useThemeHooks";
import { Continuous } from "../atoms/Continuous";
import { IconNames } from "../atoms/Icon";

/**
 * Arguments to the tabs.
 */
export type TabsProps = {
    /**
     * Style used on the container of the tabs.
     */
    style?: StyleProp<ViewStyle>;

    /**
     * If given, tabs that are laid out before the more/less button.
     */
    tabs: {
        /**
         * The icon to display.
         */
        icon: IconNames;

        /**
         * The name of the tab.
         */
        text: string;

        /**
         * True if to be rendered as active.
         */
        active?: boolean;

        /**
         * If true or node, indicator will be presented over this tab.
         */
        indicate?: boolean | ReactNode;

        /**
         * If given, invoked when the tab is pressed.
         */
        onPress?: () => void;
    }[];

    /**
     * Text to display for opening the menu.
     */
    textMore?: string;

    /**
     * Text to display for closing the menu.
     */
    textLess?: string;

    /**
     * If true or node, indicator will be presented over the more button.
     */
    indicateMore?: true | ReactNode;

    /**
     * True if activity should be indicated.
     */
    activity?: boolean;

    /**
     * If given, a notice element on top of the tabs.
     */
    notice?: string | ReactNode;

    /**
     * The content to render in the more-area.
     */
    children?: ReactNode;
};

/**
 * Operations provided by the navigator.
 */
export type TabsRef = {
    /**
     * Closes the more-area with animations.
     */
    close(): boolean;

    /**
     * Opens the more-area with animations.
     */
    open(): boolean;

    /**
     * Closes the more-area immediately.
     */
    closeImmediately(): boolean;
};

/**
 * Allow components in tabs to get access to the Tab properties.
 */
const TabsContext = createContext<TabsRef & { isOpen: boolean }>({
    close: () => false,
    open: () => false,
    closeImmediately: () => false,
    isOpen: false,
});

/**
 * Expose the Tabs Context as a hook
 */
export const useTabs = () => useContext(TabsContext);

/**
 * A row of tabs and a "more" button.
 *
 * Adds a child under it containing the more-area. When opened by pressing
 * or dragging, translates it into view and overlays the containing view with
 * a semi-opaque layer.
 */
export const Tabs = forwardRef<TabsRef, TabsProps>(({ style, tabs, textMore = "More", textLess = "Less", indicateMore, activity, notice, children }, ref) => {
    // Computed styles.
    const styleDismiss = useThemeBackground("darken");
    const fillBackground = useThemeBackground("background");
    const bordersDarken = useThemeBorder("darken");

    // State if currently open.
    const [state, setState] = useState<"closed" | "transitioning" | "open">("closed");

    // Height of the content rendered as children. Start is used for pan gesture, offset is used to animate the actual openness.
    const height = useSharedValue(300);
    const start = useSharedValue(0);
    const offset = useSharedValue(0);

    // Derived state from animated value.
    useDerivedValue(() => {
        if (offset.value === 0) runOnJS(setState)("closed");
        else if (offset.value === 1) runOnJS(setState)("open");
        else runOnJS(setState)("transitioning");
    }, [offset]);

    // Derive opacity from offset. If completely closed, translate out.
    const dynamicDismiss = useAnimatedStyle(
        () => ({
            opacity: offset.value,
            transform: [
                {
                    translateY: offset.value === 0 ? 99999 : 0,
                },
            ],
        }),
        [offset],
    );

    // Derive transformation from offset.
    const dynamicContainer = useAnimatedStyle(
        () => ({
            transform: [{ translateY: -offset.value * height.value }],
        }),
        [offset, height],
    );

    // Opens the more area and runs the handlers.
    const open = useCallback(() => {
        if (state === "open") return false;
        offset.value = withTiming(1, { duration: 234, easing: Easing.out(Easing.cubic) });
        return true;
    }, [state, offset]);

    // Closes the more area and runs the handlers.
    const close = useCallback(() => {
        if (state === "closed") return false;
        offset.value = withTiming(0, { duration: 234, easing: Easing.out(Easing.cubic) });
        return true;
    }, [state, offset]);

    // Closes the more area immediately and runs the handlers.
    const closeImmediately = useCallback(() => {
        if (state === "closed") return false;
        offset.value = 0;
        return true;
    }, [state, offset]);

    // Handle to invoke internal mutations from outside if needed.
    useImperativeHandle(ref, () => ({ open, close, closeImmediately }), [open, close, closeImmediately]);

    // Enable panning the navigator to dismiss. Only available if open.
    const gesture = Gesture.Pan()
        .onBegin(() => {
            // Remember old value and cancel current animation.
            start.value = offset.value;
            cancelAnimation(offset);
        })
        .onUpdate((e) => {
            // Update from translation.
            offset.value = -e.translationY / height.value + start.value;
            offset.value = Math.max(0, Math.min(offset.value, 1));
        })
        .onEnd((e) => {
            // Compute threshold from direction.
            const threshold = e.translationY > 0 ? 0.9 : 0.1;
            // Close if smaller than threshold, otherwise open again.
            const targetIsOpen = offset.value >= threshold;
            const targetValue = targetIsOpen ? 1 : 0;

            offset.value = withTiming(targetValue, { duration: 234, easing: Easing.out(Easing.cubic) });
        });

    const pointerEvents = useMemo(() => {
        if (state === "transitioning") return "none";
        return undefined;
    }, [state]);

    // Tab icon, down-arrow displayed when open or transitioning.
    const tabIcon = useMemo(() => {
        if (state === "open" || state === "transitioning") return "arrow-down-circle";
        return "menu";
    }, [state]);

    // Tab text, less displayed when open or transitioning.
    const tabText = useMemo(() => {
        if (state === "open" || state === "transitioning") return textLess;
        return textMore;
    }, [state, textLess, textMore]);

    // Tab press handler. Opposite returned, transitioning undefined.
    const tabOnPress = useMemo(() => {
        if (state === "open") return close;
        if (state === "closed") return open;
        return undefined;
    }, [state, close, open]);

    // Connect to back handler.
    useEffect(() => {
        if (Platform.OS === "web") return;

        // Add handler and return removal.
        const subscription = BackHandler.addEventListener("hardwareBackPress", () => close() ?? false);
        return () => subscription.remove();
    }, [close]);

    return (
        <TabsContext.Provider value={{ close, open, closeImmediately, isOpen: offset.value > 0 }}>
            {/* Dismissal area. */}
            <Animated.View style={[styles.dismiss, styleDismiss, dynamicDismiss]}>
                <TouchableWithoutFeedback containerStyle={StyleSheet.absoluteFill} style={StyleSheet.absoluteFill} onPress={close} />
            </Animated.View>

            <GestureDetector gesture={gesture}>
                <Animated.View style={dynamicContainer}>
                    {/* TODO: Animation */}
                    {!notice ? null : (
                        <View style={styles.zeroFromTop}>
                            <View style={styles.zeroFromBottom}>{notice}</View>
                        </View>
                    )}

                    <View style={[styles.tabs, bordersDarken, fillBackground, style]} pointerEvents={pointerEvents}>
                        {/* Dynamic tabs. */}
                        {tabs?.map((tab, i) => <Tab key={i} icon={tab.icon} text={tab.text} active={tab.active} indicate={tab.indicate} onPress={tab.onPress} />) ?? null}

                        {/* More-tab. */}
                        <Tab icon={tabIcon} text={tabText} onPress={tabOnPress} indicate={indicateMore} />

                        <Continuous style={styles.activity} active={activity} />
                    </View>

                    {/* Children rendered as the expandable content. */}
                    <View
                        style={[styles.content, fillBackground]}
                        onLayout={(e) => {
                            height.value = e.nativeEvent.layout.height || height.value;
                        }}
                    >
                        {children}
                    </View>
                </Animated.View>
            </GestureDetector>
        </TabsContext.Provider>
    );
});

const styles = StyleSheet.create({
    root: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        justifyContent: "flex-end",
        overflow: "hidden",
    },
    dismiss: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    zeroFromTop: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
    },
    zeroFromBottom: {
        position: "absolute",
        left: 0,
        bottom: 0,
        right: 0,
    },
    tabs: {
        flexDirection: "row",
        borderTopWidth: 1,
        borderBottomWidth: 1,
    },
    activity: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
    },
    content: {
        position: "absolute",
        left: 0,
        top: "100%",
        right: 0,
    },
});
