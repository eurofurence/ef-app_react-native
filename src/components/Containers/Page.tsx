import Ionicons from "@expo/vector-icons/Ionicons";
import { FC, useEffect, useMemo } from "react";
import { StyleSheet, View, Text, ViewProps } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { useTheme } from "../../context/Theme";
import { IoniconsNames } from "../../types/Ionicons";

const iconSize = 20;

/**
 * Arguments to the page.
 */
export type PageProps = {
    /**
     * True if to be rendered as active.
     */
    active?: boolean;

    /**
     * If given, invoked when the tab is pressed.
     */
    onPress?: () => void;

    /**
     * Called on layout.
     */
    onLayout?: ViewProps["onLayout"];

    /**
     * Height of the active indicator.
     */
    indicatorHeight?: number;

    /**
     * The icon of the page.
     */
    icon?: IoniconsNames;

    /**
     * The caption of the page.
     */
    text?: string;
};

/**
 * Page is an icon or caption view intended for use in the top-navigation control.
 * @constructor
 */
export const Page: FC<PageProps> = ({ icon, text, active, onPress, onLayout, indicatorHeight = 4 }) => {
    const theme = useTheme();
    const container = useMemo(() => (icon ? styles.containerStatic : styles.containerGrow), [icon]);
    const border = useMemo(() => ({ borderBottomColor: theme.secondary }), [theme, active]);
    const color = useMemo(() => ({ color: active ? theme.secondary : theme.text }), [theme, active]);

    const status = useSharedValue(active ? 1 : 0);
    useEffect(() => {
        status.value = withTiming(active ? 1 : 0, { duration: 234, easing: Easing.out(Easing.cubic) });
    }, [active, status]);

    const dynamicBorder = useAnimatedStyle(
        () => ({
            borderBottomWidth: status.value * indicatorHeight,
        }),
        [status, indicatorHeight]
    );

    return (
        <View style={container} onLayout={onLayout}>
            <TouchableOpacity containerStyle={container} style={[styles.page, border]} onPress={onPress}>
                <Animated.View style={[styles.border, border, dynamicBorder]} />
                {icon ? (
                    <View style={styles.item}>
                        <Ionicons name={icon} size={iconSize} color={active ? theme.secondary : theme.text} />
                    </View>
                ) : (
                    <View style={styles.item}>
                        <Text style={[styles.text, color]}>{text ?? " "}</Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    containerStatic: {
        flexDirection: "row",
        alignItems: "stretch",
    },
    containerGrow: {
        flexDirection: "row",
        alignItems: "stretch",
        flexGrow: 1,
    },
    page: {
        alignItems: "center",
        padding: 16,
        flex: 1,
    },
    border: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    item: {
        alignSelf: "stretch",
        alignItems: "center",
        height: iconSize,
        justifyContent: "center",
    },
    text: {
        fontWeight: "bold",
    },
});
