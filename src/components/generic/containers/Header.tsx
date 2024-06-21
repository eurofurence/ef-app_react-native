import { useNavigation } from "@react-navigation/core";
import React, { FC, PropsWithChildren } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { Row } from "./Row";
import { useThemeBackground, useThemeBorder, useThemeColorValue } from "../../../hooks/themes/useThemeHooks";
import { Icon, IconNames } from "../atoms/Icon";
import { Label } from "../atoms/Label";

const iconSize = 32;

export type HeaderProps = PropsWithChildren<
    | {
          style?: ViewStyle;
      }
    | {
          style?: ViewStyle;
          secondaryIcon: IconNames;
          secondaryPress: () => void;
      }
>;

export const Header: FC<HeaderProps> = (props) => {
    const colorValue = useThemeColorValue("text");
    const styleBackground = useThemeBackground("background");
    const styleBorder = useThemeBorder("darken");

    const navigation = useNavigation();

    return (
        <Row style={[styles.container, styleBackground, styleBorder, props.style]} type="center" variant="spaced">
            <Icon name="chevron-left" size={iconSize} color={colorValue} />

            <Label style={styles.text} type="lead" ellipsizeMode="tail" numberOfLines={1}>
                {props.children}
            </Label>

            <View style={styles.placeholder} />

            {/* Optional secondary action. */}
            {!("secondaryIcon" in props) ? null : <Icon name={props.secondaryIcon} size={iconSize} color={colorValue} />}

            <TouchableOpacity containerStyle={styles.back} onPress={() => navigation.goBack()} />

            {/* Optional secondary touchable, placed over icon. */}
            {!("secondaryIcon" in props) ? null : <TouchableOpacity containerStyle={styles.secondary} onPress={() => props.secondaryPress()} />}
        </Row>
    );
};

const styles = StyleSheet.create({
    container: {
        borderBottomWidth: 1,
        paddingTop: 15,
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    text: {
        flex: 1,
    },
    placeholder: {
        width: iconSize,
        height: iconSize,
    },
    back: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: "30%",
    },
    secondary: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        width: "30%",
    },
    activity: {
        position: "absolute",
        left: 0,
        bottom: 0,
        right: 0,
    },
});
