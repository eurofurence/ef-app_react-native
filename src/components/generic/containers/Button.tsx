import * as React from "react";
import { FC, ReactElement, ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useThemeBackground, useThemeColorValue } from "../../../hooks/themes/useThemeHooks";
import { Icon, IconNames } from "../atoms/Icon";
import { Label } from "../atoms/Label";

const iconSize = 20;
const pad = 8;
const border = 2;

/**
 * Arguments to the button.
 */
export type ButtonProps = {
    containerStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;

    /**
     * True if outline button instead of filled button.
     */
    outline?: boolean;

    /**
     * If given, displayed as the button's icon.
     */
    icon?: IconNames | ReactElement | ((props: { size: number; color: string }) => ReactNode);

    /**
     * If given, displayed as the button's icon, this is displayed on the right side.
     */
    iconRight?: IconNames | ReactElement | ((props: { size: number; color: string }) => ReactNode);

    /**
     * The text of the button.
     */
    children?: ReactNode;

    /**
     * If given, invoked on button press.
     */
    onPress?: () => void;

    /**
     * If given, invoked on long press.
     */
    onLongPress?: () => void;

    /**
     * If true, button is disabled.
     */
    disabled?: boolean;
};

export const Button: FC<ButtonProps> = ({ containerStyle, style, outline, icon, iconRight, children, onPress, onLongPress, disabled }) => {
    // Computed styles.
    const base = outline ? styles.containerOutline : styles.containerFill;
    const fill = useThemeBackground(outline ? "background" : "inverted");
    const color = useThemeColorValue(outline ? "important" : "invImportant");

    let iconComponent;
    if (!icon) iconComponent = <View style={styles.placeholder} />;
    else if (typeof icon === "string") iconComponent = <Icon name={icon} size={iconSize} color={color} />;
    else if (icon instanceof Function) iconComponent = icon({ size: iconSize, color });
    else iconComponent = icon;

    let iconRightComponent;
    if (!iconRight) iconRightComponent = <View style={styles.placeholder} />;
    else if (typeof iconRight === "string") iconRightComponent = <Icon name={iconRight} size={iconSize} color={color} />;
    else if (iconRight instanceof Function) iconRightComponent = iconRight({ size: iconSize, color });
    else iconRightComponent = iconRight;

    return (
        <TouchableOpacity containerStyle={containerStyle} style={[styles.container, base, fill, style]} onPress={onPress} onLongPress={onLongPress} disabled={disabled}>
            {iconComponent}

            <Label style={styles.text} color={outline ? "important" : "invImportant"}>
                {children}
            </Label>

            {iconRightComponent}
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
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
