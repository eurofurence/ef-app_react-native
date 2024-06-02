import React, { FC } from "react";
import { StyleSheet, TextProps, View, ViewProps } from "react-native";

import { Row } from "./Row";
import { ThemeColor } from "../../context/Theme";
import { useThemeBackground } from "../../hooks/useThemeHooks";
import Icon, { IconNames } from "../Atoms/Icon";
import { Label, LabelProps } from "../Atoms/Label";

const iconSize = 32; // Matches H1 font size.

export type BadgeProps = ViewProps & {
    unpad: number;
    badgeColor?: ThemeColor;
    textColor: ThemeColor;
    textType?: LabelProps["type"];
    textVariant?: LabelProps["variant"];
    icon?: IconNames;
    children: TextProps["children"];
};

export const Badge: FC<BadgeProps> = ({ unpad, badgeColor, textColor, textType = "h3", textVariant = "middle", icon, children }) => {
    const styleBadgeColor = useThemeBackground(badgeColor ?? "transparent");
    const styleContainer = { marginHorizontal: -unpad };
    const styleContent = { paddingVertical: 10, paddingHorizontal: unpad };

    return (
        <View style={[styleContainer, styleBadgeColor]}>
            <Row style={[styles.content, styleContent]}>
                {!icon ? null : <Icon name={icon} size={iconSize} color={textColor} />}
                <Label style={styles.text} color={textColor} ml={10} type={textType} variant={textVariant}>
                    {children}
                </Label>
            </Row>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        paddingVertical: 10,
    },
    text: {
        flex: 1,
    },
});