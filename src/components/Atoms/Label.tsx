import {FC, useMemo} from 'react'
import {StyleProp, StyleSheet, Text, TextStyle, ViewStyle} from 'react-native'

import {Theme, useTheme} from '../../context/Theme'

export interface LabelProps {
    style?: StyleProp<ViewStyle>
    type?: keyof typeof types
    variant?: keyof typeof variants
    color?: keyof Theme
    ml?: number
    mt?: number
    mr?: number
    mb?: number
    children?: string
}

export const Label: FC<LabelProps> = ({
    style,
    type = 'span',
    variant = 'regular',
    color = 'text',
    ml,
    mt,
    mr,
    mb,
    children
}) => {
    // Get theme for resolution.
    const theme = useTheme()

    // Create computed part.
    const resType = useMemo(() => (type ? types[type] : null), [type])
    const resVariant = useMemo(() => (variant ? variants[variant] : null), [variant])
    const marginColor = useMemo(() => {
        const result: StyleProp<TextStyle> = {color: theme[color]}
        if (typeof ml === 'number') result.marginLeft = ml
        if (typeof mt === 'number') result.marginTop = ml
        if (typeof mr === 'number') result.marginRight = ml
        if (typeof mb === 'number') result.marginBottom = ml
        return result
    }, [ml, mt, mr, mb, theme, color])

    // Return styled text.
    return <Text style={[resType, resVariant, marginColor, style]}>{children}</Text>
}

const types = StyleSheet.create({
    h1: {
        fontWeight: '300',
        fontSize: 32,
        lineHeight: 40
    },
    h2: {
        fontSize: 24,
        lineHeight: 28
    },
    h3: {
        fontSize: 20,
        lineHeight: 24
    },
    h4: {
        fontSize: 17,
        lineHeight: 20,
        fontWeight: 'bold'
    },
    span: {
        fontSize: 14,
        lineHeight: 18
    }
})

const variants = StyleSheet.create({
    regular: {},
    bold: {fontWeight: 'bold'},
    striked: {textDecorationLine: 'underline'},
    underlined: {textDecorationLine: 'underline'}
})
