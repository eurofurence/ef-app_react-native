import { FC, ReactNode } from "react";
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

import { useThemeBackground, useThemeColorValue } from "../../../hooks/themes/useThemeHooks";
import Icon, { IconNames } from "../atoms/Icon";
import { Label } from "../atoms/Label";

/**
 * Arguments to the tab.
 */
export type TabProps = {
    /**
     * Root container style.
     */
    style?: StyleProp<ViewStyle>;

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
     * True if on inverted background.
     */
    inverted?: boolean;

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
export const Tab: FC<TabProps> = ({ style, icon, text, indicate, active = false, inverted = false, onPress }) => {
    const colorName = inverted ? (active ? "invImportant" : "invText") : active ? "secondary" : "text";
    const colorValue = useThemeColorValue(colorName);
    const styleBackground = useThemeBackground("notification");

    return (
        <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
            <View style={styles.item}>
                <Icon name={icon} size={24} color={colorValue} />

                {!indicate ? null : (
                    <View style={styles.indicatorArea}>
                        <View style={styles.indicatorLocator}>
                            <View style={[styles.indicatorContent, styleBackground]}>{indicate === true ? null : indicate}</View>
                        </View>
                    </View>
                )}
            </View>
            <View style={styles.item}>
                <Label variant="middle" color={colorName}>
                    {text}
                </Label>
            </View>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 16,
    },
    item: {
        alignSelf: "stretch",
        alignItems: "center",
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
