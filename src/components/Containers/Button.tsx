import * as React from "react";
import { FC, ReactNode, useMemo } from "react";
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

import { useTheme, useThemeBackground, useThemeColorValue } from "../../hooks/useThemeHooks";
import Icon, { IconNames } from "../Atoms/Icon";
import { Label } from "../Atoms/Label";

const iconSize = 20;
const pad = 8;
const border = 2;

/**
 * Arguments to the button.
 */
export type ButtonProps = {
    /**
     * The style button.
     */
    style?: StyleProp<ViewStyle>;

    /**
     * True if outline button instead of filled button.
     */
    outline?: boolean;

    /**
     * If given, displayed as the button's icon.
     */
    icon?: IconNames;

    /**
     * If given, displayed as the button's icon, this is displayed on the right side.
     */
    iconRight?: IconNames;

    /**
     * The text of the button.
     */
    children?: ReactNode;

    /**
     * If given, invoked on button press.
     */
    onPress?: () => void;

    onLongPress?: () => void;

    disabled?: boolean;
};

export const Button: FC<ButtonProps> = ({ style, outline, icon, iconRight, children, onPress, onLongPress, disabled }) => {
    // Computed styles.
    const base = outline ? styles.containerOutline : styles.containerFill;
    const fill = useThemeBackground(outline ? "background" : "inverted");
    const color = useThemeColorValue(outline ? "important" : "invImportant");

    return (
        <TouchableOpacity style={[styles.container, base, fill, style]} onPress={onPress} onLongPress={onLongPress} disabled={disabled}>
            {!icon ? <View style={styles.placeholder} /> : <Icon name={icon} size={iconSize} color={color} />}

            <Label style={styles.text} color={outline ? "important" : "invImportant"}>
                {children}
            </Label>

            {!iconRight ? <View style={styles.placeholder} /> : <Icon name={iconRight} size={iconSize} color={color} />}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    containerFill: {
        padding: pad,
        backgroundColor: "black",
    },
    containerOutline: {
        padding: pad - border,
        borderColor: "black",
        borderWidth: border,
    },
    placeholder: {
        width: iconSize,
        height: iconSize,
    },
    text: {
        textAlign: "center",
        textAlignVertical: "center",
    },
    outlineText: {
        textAlign: "center",
        textAlignVertical: "center",
    },
});
