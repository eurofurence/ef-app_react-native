import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Gesture, GestureDetector, TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated, { Easing, runOnJS, useAnimatedProps, useAnimatedReaction, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import Ionicons from '@expo/vector-icons/Ionicons';


const Tab = ({ icon, text, indicate, active, onPress }) => {
    return <TouchableOpacity containerStyle={styles.tabContainer} style={styles.tab} hitSlop={16} onPress={onPress}>
        <View style={styles.tabLine}>
            <Ionicons name={icon} size={24} color={active ? "blue" : "black"} />

            {!indicate ? null : <View style={styles.indicatorArea}>
                <View style={styles.indicatorLocator}>
                    <View style={styles.indicatorContent}>
                        {indicate === true ? null : indicate}
                    </View>
                </View>
            </View>}
        </View>
        <View style={styles.tabLine}>
            <Text style={{ color: active ? "blue" : "black" }}>{text}</Text>
        </View>
    </TouchableOpacity>;
};

const quickCubicOut = {
    duration: 234,
    easing: Easing.out(Easing.cubic),
};

export const Navigator = forwardRef(({ tabs, indicateMore, onOpen, onClose, children }, ref) => {
    // Height of the content rendered as children, state if currently open.
    const [height, setHeight] = useState(425);
    const [open, setOpen] = useState(false);

    // Start is used for pan gesture, offset is used to animate the actual openness.
    const start = useSharedValue(0);
    const offset = useSharedValue(0);

    // Nove to desired target state on change of relevant properties.
    useEffect(() => {
        if (open && offset.value < 1)
            offset.value = withTiming(1, quickCubicOut);
        else if (!open && offset.value > 0)
            offset.value = withTiming(0.0, quickCubicOut);
    }, [offset, open, height]);

    // Derive opacity and transformation from offset.
    const dynamicDismiss = useAnimatedStyle(() => ({
        opacity: 0.2 * offset.value,
    }), [offset]);

    const dynamicContainer = useAnimatedStyle(() => ({
        transform: [{ translateY: -offset.value * height }],
    }), [offset, height]);

    // Handle to invoke internal mutations from outside if needed.
    useImperativeHandle(ref, () => ({
        close: () => setOpen(false),
        open: () => setOpen(true),
        closeImmediately: () => {
            offset.value = 0;
            setOpen(false);
        },
    }), [offset]);

    // React to change of offset value in order to universally dispatch opening and closing callbacks.
    useAnimatedReaction(() => offset.value > 0, data => {
        if (data)
            onOpen && runOnJS(onOpen)();
        else
            onClose && runOnJS(onClose)();
    }, [offset]);

    // Enable panning the navigator to dismiss. Only available if open.
    const gesture = Gesture.Pan()
        // .enabled(open)
        .onBegin(() => {
            start.value = offset.value
        })
        .onUpdate(e => {
            // Update from translation.
            offset.value = (-e.translationY / height + start.value)
            offset.value = Math.max(0, Math.min(offset.value, 1));
        }).onEnd(e => {
            // Compute threshold from direction.
            const threshold = e.translationY > 0 ? 0.7 : 0.3;

            // Close if smaller than threshold, otherwise open again.
            if (offset.value < threshold) {
                offset.value = withTiming(0, quickCubicOut);
                runOnJS(setOpen)(false);
            } else {
                offset.value = withTiming(1, quickCubicOut);
                runOnJS(setOpen)(true);
            }
        })

    // TODO: Add safe area to tabs.
    // TODO: Integration with back button.

    // Returns a gesture recognizer that contains the entire view. Contains a touchable for
    // dismissal and the view panning out the child content. Renders a set of tabs and the children under it.
    return <View style={styles.root} pointerEvents="box-none">
        {/* Dismissal area. */}
        <View style={StyleSheet.absoluteFill} pointerEvents={open ? "auto" : "none"}>
            <TouchableWithoutFeedback containerStyle={StyleSheet.absoluteFill} style={StyleSheet.absoluteFill} disabled={!open} onPress={() => setOpen(false)}>
                <Animated.View style={[styles.dismiss, dynamicDismiss]} />
            </TouchableWithoutFeedback>
        </View>

        <GestureDetector gesture={gesture}>
            <Animated.View style={dynamicContainer}>
                <View style={styles.tabs}>
                    {/* Dynamic tabs. */}
                    {tabs?.map((tab, i) => <Tab key={i}
                        icon={tab.icon}
                        text={tab.text}
                        active={tab.active}
                        indicate={tab.indicate}
                        onPress={tab.onPress} />) ?? null}

                    {/* More-tab. */}
                    <Tab
                        icon={open ? "arrow-down-circle" : "menu"}
                        text={open ? "Less" : "More"}
                        indicate={indicateMore}
                        onPress={() => setOpen((current) => !current)} />
                </View>

                {/* Children rendered as the expandable content. */}
                <View style={styles.content} onLayout={(e) => setHeight(e.nativeEvent.layout.height)}>
                    {children}
                </View>
            </Animated.View>
        </GestureDetector>
    </View>;
});

const styles = StyleSheet.create({
    tabContainer: {
        flex: 1,
    },
    tab: {
        alignItems: "center",
        padding: 16,
    },
    tabLine: {
        alignSelf: 'stretch',
        alignItems: 'center',
    },
    indicatorArea: {
        position: 'absolute',
        width: 24,
        height: 24,
    },
    indicatorLocator: {
        position: 'absolute',
        top: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    indicatorContent: {
        position: 'absolute',
        minWidth: 12,
        minHeight: 12,
        padding: 4,
        borderRadius: 99999,
        backgroundColor: 'red'
    },
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
        backgroundColor: "black",
    },
    container: {
        backgroundColor: "white",
    },
    tabs: {
        flexDirection: "row",
        backgroundColor: "white",
        borderTopColor: '#dddddd',
        borderTopWidth: 1,
        borderBottomColor: '#dddddd',
        borderBottomWidth: 1
    },
    content: {
        position: 'absolute',
        left: 0, top: '100%', right: 0,
        backgroundColor: "white",
    },
});
