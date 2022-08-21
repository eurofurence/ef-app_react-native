import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import React, { FC, useMemo } from "react";
import { ColorValue, StyleSheet, TextProps, View, ViewProps, ViewStyle } from "react-native";

import { IconNames } from "../../types/IconNames";
import { Label, LabelProps } from "../Atoms/Label";
import { Row } from "./Row";

const iconSize = 32; // Matches H1 font size.

export type BadgeInvPadProps = ViewProps & {
    padding: number;
    badgeColor?: ColorValue;
    textColor: ColorValue;
    textType?: LabelProps["type"];
    textVariant?: LabelProps["variant"];
    icon?: IconNames;
    children: TextProps["children"];
};

export const BadgeInvPad: FC<BadgeInvPadProps> = ({ padding, badgeColor, textColor, textType = "h3", textVariant = "middle", icon, children }) => {
    const styleContainer = useMemo<ViewStyle>(() => ({ marginHorizontal: -padding, backgroundColor: badgeColor ?? "transparent" }), [padding, badgeColor]);
    const styleContent = useMemo<ViewStyle>(() => ({ paddingVertical: 10, paddingHorizontal: padding }), [padding]);

    return (
        <View style={styleContainer}>
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
