import Ionicons from "@expo/vector-icons/Ionicons";
import { FC, useEffect, useMemo } from "react";
import { StyleSheet, View, Text } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { useTheme } from "../../context/Theme";
import { IoniconsNames } from "../../types/Ionicons";

/**
 * Arguments to the page.
 */
export type PageProps = {
    /**
     * The icon to display.
     */
    icon?: IoniconsNames;

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
};

export const Page: FC<PageProps> = ({ icon, text, active, onPress, indicatorHeight = 4 }) => {
    const theme = useTheme();
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
        <TouchableOpacity containerStyle={styles.container} style={[styles.page, border]} onPress={onPress}>
            <Animated.View style={[styles.border, border, dynamicBorder]} />
            {!icon ? null : (
                <View style={[styles.item]}>
                    <Ionicons name={icon} size={24} color={active ? theme.secondary : theme.text} />
                </View>
            )}

            <View style={styles.item}>
                <Text style={[styles.text, color]}>{text}</Text>
            </View>
        </TouchableOpacity>
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
