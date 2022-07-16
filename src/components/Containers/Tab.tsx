import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import { FC, ReactNode, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useTheme } from "../../context/Theme";
import { IconNames } from "../../types/IconNames";

/**
 * Arguments to the tab.
 */
export type TabProps = {
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
};

/**
 * Tab is an icon/caption combo intended for use in the bottom-navigation control.
 * @constructor
 */
export const Tab: FC<TabProps> = ({ icon, text, indicate, active, onPress }) => {
    const theme = useTheme();
    const color = useMemo(() => ({ color: active ? theme.secondary : theme.text }), [theme, active]);
    const fillNotify = useMemo(() => ({ backgroundColor: theme.notification }), [theme]);

    return (
        <TouchableOpacity containerStyle={styles.container} style={styles.tab} onPress={onPress}>
            <View style={styles.item}>
                <Icon name={icon} size={24} color={active ? theme.secondary : theme.text} />

                {!indicate ? null : (
                    <View style={styles.indicatorArea}>
                        <View style={styles.indicatorLocator}>
                            <View style={[styles.indicatorContent, fillNotify]}>{indicate === true ? null : indicate}</View>
                        </View>
                    </View>
                )}
            </View>
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
    tab: {
        alignItems: "center",
        padding: 16,
    },
    item: {
        alignSelf: "stretch",
        alignItems: "center",
    },
    text: {
        textAlign: "center",
    },
    indicatorArea: {
        position: "absolute",
        width: 24,
        height: 24,
    },
    indicatorLocator: {
        position: "absolute",
        top: 0,
        right: 0,
        alignItems: "center",
        justifyContent: "center",
    },
    indicatorContent: {
        position: "absolute",
        minWidth: 12,
        minHeight: 12,
        padding: 4,
        borderRadius: 99999,
    },
});
