import { createContext, forwardRef, ReactNode, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { BackHandler, Platform, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated, { cancelAnimation, Easing, useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { useThemeBackground, useThemeBorder } from "@/hooks/themes/useThemeHooks";
import { Continuous } from "../atoms/Continuous";
import { IconNames } from "../atoms/Icon";
import { Tab } from "./Tab";

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

const ANIMATION_CONFIG = {
    duration: 234,
    easing: Easing.out(Easing.cubic),
    springConfig: {
        damping: 15,
        stiffness: 100,
        mass: 1,
    },
};

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

    // Single source of truth for state
    const [isOpen, setIsOpen] = useState(false);

    // Animation values
    const height = useSharedValue(300);
    const offset = useSharedValue(0);
    const startOffset = useSharedValue(0);
    const isAnimating = useSharedValue(false);

    // Derive opacity from offset
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

    // Derive transformation from offset
    const dynamicContainer = useAnimatedStyle(
        () => ({
            transform: [{ translateY: -offset.value * height.value }],
        }),
        [offset, height],
    );

    // Add animated style for pointer events - is fix for Reanimated warning
    const dynamicPointerEvents = useAnimatedStyle(
        () => ({
            pointerEvents: isAnimating.value ? "none" : "auto",
        }),
        [isAnimating],
    );

    // Animation handlers
    const animateTo = useCallback(
        (targetValue: number) => {
            isAnimating.value = true;
            offset.value = withSpring(targetValue, ANIMATION_CONFIG.springConfig, (finished) => {
                if (finished) {
                    isAnimating.value = false;
                }
            });
        },
        [offset, isAnimating],
    );

    // State change handlers
    const open = useCallback(() => {
        if (isOpen) return false;
        setIsOpen(true);
        animateTo(1);
        return true;
    }, [isOpen, animateTo]);

    const close = useCallback(() => {
        if (!isOpen) return false;
        setIsOpen(false);
        animateTo(0);
        return true;
    }, [isOpen, animateTo]);

    const closeImmediately = useCallback(() => {
        if (!isOpen) return false;
        setIsOpen(false);
        offset.value = 0;
        isAnimating.value = false;
        return true;
    }, [isOpen, offset, isAnimating]);

    // Handle to invoke internal mutations from outside if needed.
    useImperativeHandle(ref, () => ({ open, close, closeImmediately }), [open, close, closeImmediately]);

    // Gesture handling
    const gesture = Gesture.Pan()
        .onBegin(() => {
            startOffset.value = offset.value;
            cancelAnimation(offset);
            isAnimating.value = false;
        })
        .onUpdate((e) => {
            const newOffset = -e.translationY / height.value + startOffset.value;
            offset.value = Math.max(0, Math.min(newOffset, 1));
        })
        .onEnd((e) => {
            const velocity = e.velocityY;
            const shouldOpen = offset.value > 0.5 || (offset.value > 0.2 && velocity < -500);
            const targetValue = shouldOpen ? 1 : 0;

            if (shouldOpen !== isOpen) {
                setIsOpen(shouldOpen);
            }
            animateTo(targetValue);
        });

    // Tab icon and text based on state
    const tabIcon = useMemo(() => (isOpen ? "arrow-down-circle" : "menu"), [isOpen]);
    const tabText = useMemo(() => (isOpen ? textLess : textMore), [isOpen, textLess, textMore]);

    // Connect to back handler
    useEffect(() => {
        if (Platform.OS === "web") return;
        const subscription = BackHandler.addEventListener("hardwareBackPress", () => close() ?? false);
        return () => subscription.remove();
    }, [close]);

    return (
        <TabsContext.Provider value={{ close, open, closeImmediately, isOpen }}>
            <Animated.View style={[styles.dismiss, styleDismiss, dynamicDismiss]}>
                <TouchableWithoutFeedback containerStyle={StyleSheet.absoluteFill} style={StyleSheet.absoluteFill} onPress={close} />
            </Animated.View>

            <GestureDetector gesture={gesture}>
                <Animated.View style={dynamicContainer}>
                    {notice && (
                        <View style={styles.zeroFromTop}>
                            <View style={styles.zeroFromBottom}>{notice}</View>
                        </View>
                    )}

                    <View style={[styles.tabs, bordersDarken, fillBackground, style, dynamicPointerEvents]}>
                        {tabs?.map((tab, i) => <Tab key={i} icon={tab.icon} text={tab.text} active={tab.active} indicate={tab.indicate} onPress={tab.onPress} />) ?? null}

                        <Tab icon={tabIcon} text={tabText} onPress={isOpen ? close : open} indicate={indicateMore} />

                        <Continuous style={styles.activity} active={activity} />
                    </View>

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
