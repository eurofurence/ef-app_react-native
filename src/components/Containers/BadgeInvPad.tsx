import React, { FC, useMemo } from "react";
import { ColorValue, StyleSheet, TextProps, View, ViewProps, ViewStyle } from "react-native";

import { Label } from "../Atoms/Label";

export type BadgeInvPadProps = ViewProps & {
    padding: number;
    badgeColor: ColorValue;
    textColor: ColorValue;
    children: TextProps["children"];
};

export const BadgeInvPad: FC<BadgeInvPadProps> = ({ padding, badgeColor, textColor, children }) => {
    const styleContainer = useMemo<ViewStyle>(() => ({ marginHorizontal: -padding, backgroundColor: badgeColor }), [padding, badgeColor]);
    const styleContent = useMemo<ViewStyle>(() => ({ paddingHorizontal: padding }), [padding]);

    return (
        <View style={styleContainer}>
            <Label style={[styles.content, styleContent]} color={textColor} ml={10} type="h3" variant="middle">
                {children}
            </Label>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        paddingVertical: 10,
    },
});
