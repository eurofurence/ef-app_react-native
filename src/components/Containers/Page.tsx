import Ionicons from "@expo/vector-icons/Ionicons";
import { FC, useEffect, useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { quickCubicOut } from "../../consts/animations";
import { useTheme } from "../../context/Theme";
import { IconiconsNames } from "../../types/Ionicons";

export interface PageProps {
    /**
     * The icon to display.
     */
    icon?: IconiconsNames;

    /**
     * The name of the tab.
     */
    text: string;

    /**
     * True if to be rendered as active.
     */
    active?: boolean;

    /**
     * If given, invoked when the tab is pressed.
     */
    onPress?: () => void;

    /**
     * Height of the active indicator.
     */
    indicatorHeight?: number;
}

export const Page: FC<PageProps> = ({ icon, text, active, onPress, indicatorHeight = 4 }) => {
    const theme = useTheme();
    const border = useMemo(() => ({ borderBottomColor: theme.secondary }), [theme, active]);
    const color = useMemo(() => ({ color: active ? theme.secondary : theme.text }), [theme, active]);

    const status = useSharedValue(active ? 1 : 0);
    useEffect(() => {
        if (active) status.value = withTiming(1, quickCubicOut);
        else status.value = withTiming(0, quickCubicOut);
    }, [active, status]);

    const dynamicBorder = useAnimatedStyle(
        () => ({
            borderBottomWidth: status.value * indicatorHeight,
        }),
        [status, indicatorHeight]
    );

    return (
        <TouchableWithoutFeedback containerStyle={styles.container} style={[styles.page, border]} onPress={onPress}>
            <Animated.View style={[styles.border, border, dynamicBorder]} />
            {!icon ? null : (
                <View style={[styles.item]}>
                    <Ionicons name={icon} size={24} color={active ? theme.secondary : theme.text} />
                </View>
            )}

            <View style={styles.item}>
                <Text style={[styles.text, color]}>{text}</Text>
            </View>
        </TouchableWithoutFeedback>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    page: {
        alignItems: "center",
        padding: 16,
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
    },
    text: {
        fontWeight: "bold",
    },
});
