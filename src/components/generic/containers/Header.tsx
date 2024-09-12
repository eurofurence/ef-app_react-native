import { useNavigation } from "@react-navigation/core";
import React, { FC, PropsWithChildren } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useThemeBackground, useThemeBorder, useThemeColorValue } from "../../../hooks/themes/useThemeHooks";
import { Continuous } from "../atoms/Continuous";
import { Icon, IconNames } from "../atoms/Icon";
import { Label } from "../atoms/Label";
import { Row } from "./Row";

const iconSize = 26;
const iconPad = 6;

export type HeaderProps = PropsWithChildren<
    | {
          style?: ViewStyle;
          loading?: boolean;
      }
    | {
          style?: ViewStyle;
          secondaryIcon: IconNames;
          secondaryPress: () => void;
          loading?: boolean;
      }
>;

export const Header: FC<HeaderProps> = (props) => {
    const colorValue = useThemeColorValue("text");
    const styleBackground = useThemeBackground("background");
    const styleBorder = useThemeBorder("darken");

    const navigation = useNavigation();
    return (
        <Row style={[styles.container, styleBackground, styleBorder, props.style]} type="center" variant="spaced">
            <TouchableOpacity hitSlop={180} containerStyle={styles.back} onPress={() => navigation.goBack()}>
                <Icon name="chevron-left" size={iconSize} color={colorValue} />
            </TouchableOpacity>

            <Label style={styles.text} type="lead" ellipsizeMode="tail" numberOfLines={1}>
                {props.children}
            </Label>

            {/* Optional secondary action. */}
            {!("secondaryIcon" in props) ? null : (
                <TouchableOpacity hitSlop={50} containerStyle={styles.secondary} onPress={() => props.secondaryPress()}>
                    <Icon name={props.secondaryIcon} size={iconSize} color={colorValue} />
                </TouchableOpacity>
            )}

            {
                // Loading header. Explicitly given as false, not loading.
                props.loading === false ? (
                    <Continuous style={styles.loading} active={false} />
                ) : // Explicitly given as true, loading.
                props.loading === true ? (
                    <Continuous style={styles.loading} active={true} />
                ) : // Not given, therefore no element.
                null
            }
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
        justifyContent: "center",
    },
    back: {
        marginLeft: -iconPad,
        width: iconSize + iconPad,
        height: iconSize + iconPad,
        justifyContent: "center",
        zIndex: 20,
    },
    secondary: {
        width: iconSize + iconPad,
        height: iconSize + iconPad,
        marginRight: -iconPad,
        justifyContent: "center",
        zIndex: 20,
    },
    loading: {
        position: "absolute",
        left: 0,
        bottom: 0,
        right: 0,
    },
});
