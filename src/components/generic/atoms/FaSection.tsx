import FontAwesomeIcon from '@expo/vector-icons/FontAwesome5'
import React, { FC } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { Col } from '../containers/Col'
import { Row } from '../containers/Row'
import { Label, LabelProps } from './Label'
import { ThemeColor } from '@/context/Theme'
import { useThemeBackground, useThemeColorValue } from '@/hooks/themes/useThemeHooks'

const iconSize = 32 // Matches H1 font size.

/**
 * Props to font-awesome section.
 */
export type FaSectionProps = {
    /**
     * The style to pass to the root column.
     */
    style?: StyleProp<ViewStyle>;

    /**
     * The icon, if one should be displayed.
     */
    icon?: keyof typeof FontAwesomeIcon.glpyhMap;

    /**
     * The primary text.
     */
    title: string;

    /**
     * The subtitle, displayed after the text.
     */
    subtitle?: string;

    backgroundColor?: ThemeColor;
    titleColor?: ThemeColor;
    subtitleColor?: ThemeColor;
    titleVariant?: LabelProps['variant'];
    subtitleVariant?: LabelProps['variant'];
};

export const FaSection: FC<FaSectionProps> = ({ style, icon = 'bookmark', title, subtitle, backgroundColor, titleColor, subtitleColor, titleVariant, subtitleVariant }) => {
    const styleBackground = useThemeBackground(backgroundColor ?? null)
    const iconColor = useThemeColorValue(titleColor ?? 'important')
    return (
        <Col style={[styles.container, styleBackground, style]}>
            <Row type="center">
                {!icon ? <View style={styles.placeholder} /> : <FontAwesomeIcon color={iconColor} style={styles.icon} name={icon} size={iconSize} />}
                <Label style={styles.containerFill} type="h1" variant={titleVariant} color={titleColor ?? 'important'} ellipsizeMode="tail">
                    {title}
                </Label>
            </Row>

            {!subtitle ? null : (
                <Row type="center">
                    <View style={styles.placeholder} />
                    <Label style={styles.containerFill} type="h3" variant={subtitleVariant} color={subtitleColor ?? 'text'} ellipsizeMode="tail">
                        {subtitle}
                    </Label>
                </Row>
            )}
        </Col>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 30,
        paddingBottom: 15,
    },
    placeholder: {
        width: iconSize,
        height: iconSize,
        marginRight: 8,
    },
    icon: {
        marginRight: 8,
    },
    containerFill: {
        flex: 1,
    },
})
