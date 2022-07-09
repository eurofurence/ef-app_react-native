import { forwardRef, ReactNode, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Gesture, GestureDetector, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated, { Easing, runOnJS, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { useTheme } from "../../context/Theme";
import { IoniconsNames } from "../../types/Ionicons";
import { Tab } from "./Tab";

/**
 * Arguments to the navigator.
 */
export type TabsProps = {
    /**
     * Style used on the container of the tabs.
     */
    style?: StyleProp<ViewStyle>;

    /**
     * If given, tabs that are layed out before the more/less button.
     */
    tabs?: {
        /**
         * The icon to display.
         */
        icon: IoniconsNames;

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
 * A row of tabs and a "more" button.
 *
 * Adds a child under it containing the more-area. When opened by pressing
 * or dragging, translates it into view and overlays the containing view with
 * a semi-opaque layer.
 */
export const Tabs = forwardRef<TabsRef, TabsProps>(({ style, tabs, indicateMore, onOpen, onClose, children }, ref) => {
    // Computed styles.
    const theme = useTheme();
    const fillDarken = useMemo(() => ({ backgroundColor: theme.darken }), [theme]);
    const fillBackground = useMemo(() => ({ backgroundColor: theme.background }), [theme]);
    const bordersDarken = useMemo(() => ({ borderColor: theme.darken }), [theme]);

    // Height of the content rendered as children, state if currently open.
    const [height, setHeight] = useState(425);
    const [open, setOpen] = useState(false);

    // Start is used for pan gesture, offset is used to animate the actual openness.
    const start = useSharedValue(0);
    const offset = useSharedValue(0);

    // Nove to desired target state on change of relevant properties.
    useEffect(() => {
        if (open && offset.value < 1) offset.value = withTiming(1, { duration: 234, easing: Easing.out(Easing.cubic) });
        else if (!open && offset.value > 0) offset.value = withTiming(0.0, { duration: 234, easing: Easing.out(Easing.cubic) });
    }, [offset, open]);

    // Derive opacity from offset.
    const dynamicDismiss = useAnimatedStyle(
        () => ({
            opacity: offset.value,
        }),
        [offset]
    );

    // Derive transformation from offset.
    const dynamicContainer = useAnimatedStyle(
        () => ({
            transform: [{ translateY: -offset.value * height }],
        }),
        [offset, height]
    );

    // Handle to invoke internal mutations from outside if needed.
    useImperativeHandle(
        ref,
        () => ({
            close: () => setOpen(false),
            open: () => setOpen(true),
            closeImmediately: () => {
                offset.value = 0;
                setOpen(false);
            },
        }),
        [offset]
    );

    // React to change of offset value in order to universally dispatch opening and closing callbacks.
    useAnimatedReaction(
        () => offset.value > 0,
        (data) => {
            if (data) onOpen && runOnJS(onOpen)();
            else onClose && runOnJS(onClose)();
        },
        [offset, onOpen, onClose]
    );

    // Enable panning the navigator to dismiss. Only available if open.
    const gesture = Gesture.Pan()
        // .enabled(open)
        .onBegin(() => {
            start.value = offset.value;
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
            if (offset.value < threshold) {
                offset.value = withTiming(0, { duration: 234, easing: Easing.out(Easing.cubic) });
                runOnJS(setOpen)(false);
            } else {
                offset.value = withTiming(1, { duration: 234, easing: Easing.out(Easing.cubic) });
                runOnJS(setOpen)(true);
            }
        });

    // TODO: Add safe area to tabs.
    // TODO: Integration with back button.

    return (
        <>
            {/* Dismissal area. */}
            <View style={StyleSheet.absoluteFill} pointerEvents={open ? "auto" : "none"}>
                <TouchableWithoutFeedback containerStyle={StyleSheet.absoluteFill} style={StyleSheet.absoluteFill} disabled={!open} onPress={() => setOpen(false)}>
                    <Animated.View style={[styles.dismiss, fillDarken, dynamicDismiss]} />
                </TouchableWithoutFeedback>
            </View>

            <GestureDetector gesture={gesture}>
                <Animated.View style={dynamicContainer}>
                    <View style={[styles.tabs, bordersDarken, fillBackground, style]}>
                        {/* Dynamic tabs. */}
                        {tabs?.map((tab, i) => <Tab key={i} icon={tab.icon} text={tab.text} active={tab.active} indicate={tab.indicate} onPress={tab.onPress} />) ?? null}

                        {/* More-tab. */}
                        <Tab icon={open ? "arrow-down-circle" : "menu"} text={open ? "Less" : "More"} indicate={indicateMore} onPress={() => setOpen((current) => !current)} />
                    </View>

                    {/* Children rendered as the expandable content. */}
                    <View style={[styles.content, fillBackground]} onLayout={(e) => setHeight(e.nativeEvent.layout.height || height)}>
                        {children}
                    </View>
                </Animated.View>
            </GestureDetector>
        </>
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
    content: {
        position: "absolute",
        left: 0,
        top: "100%",
        right: 0,
    },
});
