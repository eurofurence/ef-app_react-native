import { noop } from "lodash";
import { createContext, forwardRef, ReactNode, useCallback, useContext, useImperativeHandle, useMemo, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated, { cancelAnimation, Easing, runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { Tab } from "./Tab";
import { useTheme } from "../../context/Theme";
import { Activity } from "../Atoms/Activity";
import { IconNames } from "../Atoms/Icon";

/**
 * Arguments to the tabs.
 */
export type TabsProps = {
    /**
     * Style used on the container of the tabs.
     */
    style?: StyleProp<ViewStyle>;

    /**
     * If given, tabs that are layed out before the more/less button.
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
         * If true or node, indicator will be presented over the this tab.
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
     * If given, invoked when the navigator is opened by pressing more or dragging up.
     */
    onOpen?: () => void;

    /**
     * If given, invoked when the navigator is opened by pressing  less or dragging down.
     */
    onClose?: () => void;

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
    close(): void;

    /**
     * Opens the more-area with animations.
     */
    open(): void;

    /**
     * Closes the more-area immediately.
     */
    closeImmediately(): void;
};

/**
 * Allow components in tabs to get access to the Tab properties.
 */
const TabsContext = createContext<TabsRef & { isOpen: boolean }>({
    close: noop,
    open: noop,
    closeImmediately: noop,
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
export const Tabs = forwardRef<TabsRef, TabsProps>(({ style, tabs, textMore = "More", textLess = "Less", indicateMore, onOpen, onClose, children }, ref) => {
    // Computed styles.
    const theme = useTheme();
    const styleDismiss = useMemo(() => ({ backgroundColor: theme.darken }), [theme]);
    const fillBackground = useMemo(() => ({ backgroundColor: theme.background }), [theme]);
    const bordersDarken = useMemo(() => ({ borderColor: theme.darken }), [theme]);

    // Height of the content rendered as children, state if currently open.
    const [height, setHeight] = useState(425);
    const [isOpen, setIsOpen] = useState(false);

    // Start is used for pan gesture, offset is used to animate the actual openness.
    const start = useSharedValue(0);
    const offset = useSharedValue(0);

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
            transform: [{ translateY: -offset.value * height }],
        }),
        [offset, height],
    );

    // Opens the more area and runs the handlers.
    const open = useCallback(() => {
        offset.value = withTiming(1, { duration: 234, easing: Easing.out(Easing.cubic) }, (finished) => {
            if (finished) {
                runOnJS(setIsOpen)(true);
                onOpen && runOnJS(onOpen)();
            }
        });
    }, [offset]);

    // Closes the more area and runs the handlers.
    const close = useCallback(() => {
        offset.value = withTiming(0, { duration: 234, easing: Easing.out(Easing.cubic) }, (finished) => {
            if (finished) {
                runOnJS(setIsOpen)(false);
                onClose && runOnJS(onClose)();
            }
        });
    }, [offset]);

    // Closes the more area immediately and runs the handlers.
    const closeImmediately = useCallback(() => {
        offset.value = 0;
        setIsOpen(false);
        onClose && onClose();
    }, [offset]);

    // Handle to invoke internal mutations from outside if needed.
    useImperativeHandle(ref, () => ({ open, close, closeImmediately }), [open, close, closeImmediately]);

    // Enable panning the navigator to dismiss. Only available if open.
    const gesture = Gesture.Pan()
        .onBegin(() => {
            start.value = offset.value;
            cancelAnimation(offset);
        })
        .onUpdate((e) => {
            // Update from translation.
            offset.value = -e.translationY / height + start.value;
            offset.value = Math.max(0, Math.min(offset.value, 1));
        })
        .onEnd((e) => {
            // Compute threshold from direction.
            const threshold = e.translationY > 0 ? 0.9 : 0.1;

            // Close if smaller than threshold, otherwise open again.
            const targetIsOpen = offset.value >= threshold;
            const targetValue = targetIsOpen ? 1 : 0;
            offset.value = withTiming(targetValue, { duration: 234, easing: Easing.out(Easing.cubic) }, (finished) => {
                if (finished) {
                    runOnJS(setIsOpen)(targetIsOpen);

                    if (targetIsOpen) onOpen && runOnJS(onOpen)();
                    else onClose && runOnJS(onClose)();
                }
            });
        });

    // TODO: Add safe area to tabs.
    // TODO: Integration with back button.

    return (
        <TabsContext.Provider value={{ close, open, closeImmediately, isOpen: offset.value > 0 }}>
            {/* Dismissal area. */}
            <Animated.View style={[styles.dismiss, styleDismiss, dynamicDismiss]}>
                <TouchableWithoutFeedback containerStyle={StyleSheet.absoluteFill} style={StyleSheet.absoluteFill} onPress={close} />
            </Animated.View>

            <GestureDetector gesture={gesture}>
                <Animated.View style={dynamicContainer}>
                    <View style={[styles.tabs, bordersDarken, fillBackground, style]}>
                        {/* Dynamic tabs. */}
                        {tabs?.map((tab, i) => <Tab key={i} icon={tab.icon} text={tab.text} active={tab.active} indicate={tab.indicate} onPress={tab.onPress} />) ?? null}

                        {/* More-tab. */}
                        <Tab icon={isOpen ? "arrow-down-circle" : "menu"} text={isOpen ? textLess : textMore} indicate={indicateMore} onPress={isOpen ? close : open} />

                        <Activity style={styles.activity} />
                    </View>

                    {/* Children rendered as the expandable content. */}
                    <View style={[styles.content, fillBackground]} onLayout={(e) => setHeight(e.nativeEvent.layout.height || height)}>
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
