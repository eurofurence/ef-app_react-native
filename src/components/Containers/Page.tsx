import { FC } from "react";
import { StyleSheet, TouchableOpacity, View, ViewProps } from "react-native";

import { useThemeBackground, useThemeColorValue } from "../../hooks/useThemeHooks";
import Icon, { IconNames } from "../Atoms/Icon";
import { Label } from "../Atoms/Label";

const iconSize = 20;

/**
 * Arguments to the page.
 */
export type PageProps = {
    /**
     * The icon of the page.
     */
    icon?: IconNames;

    /**
     * The caption of the page.
     */
    text?: string;

    /**
     * True if to be rendered as active.
     */
    active?: boolean;

    /**
     * True if this page should be highlighted.
     */
    highlight?: boolean;

    /**
     * If given, invoked when the tab is pressed.
     */
    onPress?: () => void;

    /**
     * Called on layout.
     */
    onLayout?: ViewProps["onLayout"];
};

/**
 * Page is an icon or caption view intended for use in the top-navigation control.
 * @constructor
 */
export const Page: FC<PageProps> = ({ icon, text, active = false, highlight = false, onPress, onLayout }) => {
    // The color to use for icon or text, i.e., foreground.
    const colorName = highlight ? (active ? "invImportant" : "invText") : active ? "secondary" : "text";
    const colorValue = useThemeColorValue(colorName);

    // The style of the container and the item.
    const styleContainer = icon ? styles.containerStatic : styles.containerGrow;
    const styleItem = useThemeBackground(highlight ? "secondary" : null);

    return (
        <View style={styleContainer} onLayout={onLayout}>
            <TouchableOpacity style={styleContainer} onPress={onPress}>
                {icon ? (
                    <View style={[styles.item, styleItem]}>
                        <Icon name={icon} size={iconSize} color={colorValue} />
                    </View>
                ) : (
                    <View style={[styles.item, styleItem]}>
                        <Label style={styles.text} color={colorName}>
                            {text ?? " "}
                        </Label>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    containerStatic: {
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 6,
    },
    containerGrow: {
        flexDirection: "row",
        justifyContent: "center",
        paddingVertical: 6,
        flexGrow: 1,
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
        height: iconSize + 12,
        justifyContent: "center",
        padding: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    text: {
        fontWeight: "bold",
    },
});
