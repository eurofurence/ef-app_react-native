import Icon from "@expo/vector-icons/MaterialCommunityIcons";
import React, { FC } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { IconNames } from "../../types/IconNames";
import { Col } from "../Containers/Col";
import { Row } from "../Containers/Row";
import { Label } from "./Label";

const iconSize = 32; // Matches H1 font size.

/**
 * Props to section.
 */
export type SectionProps = {
    /**
     * The style to pass to the root column.
     */
    style?: StyleProp<ViewStyle>;

    /**
     * The icon, if one should be displayed.
     */
    icon?: IconNames;

    /**
     * The primary text.
     */
    title: string;

    /**
     * The subtitle, displayed after the text.
     */
    subtitle?: string;
};

export const Section: FC<SectionProps> = React.memo(({ style, icon = "bookmark", title, subtitle }) => {
    return (
        <Col style={[styles.container, style]}>
            <Row type="center">
                {!icon ? <View style={styles.placeholder} /> : <Icon style={styles.icon} name={icon} size={iconSize} />}
                <Label style={styles.fill} type="h1" color="important" ellipsizeMode="tail">
                    {title}
                </Label>
            </Row>

            {!subtitle ? null : (
                <Row type="center">
                    <View style={styles.placeholder} />
                    <Label style={styles.fill} type="h3" ellipsizeMode="tail">
                        {subtitle}
                    </Label>
                </Row>
            )}
        </Col>
    );
});

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        marginBottom: 15,
    },
    placeholder: {
        width: iconSize,
        height: iconSize,
        marginRight: 8,
    },
    icon: {
        marginRight: 8,
    },
    fill: {
        flex: 1,
    },
});
