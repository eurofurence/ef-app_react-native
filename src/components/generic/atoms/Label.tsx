import { FC } from 'react'
import { StyleSheet, Text, TextProps } from 'react-native'

import { ThemeColor } from '@/context/Theme'
import { useThemeColor } from '@/hooks/themes/useThemeHooks'

/**
 * Props to label.
 */
export type LabelProps = TextProps & {
  /**
   * The type, one of some predefined primary style values.
   */
  type?: keyof typeof labelTypeStyles

  /**
   * The variant, one of some predefined secondary style values, overriding type.
   */
  variant?: keyof typeof labelVariantStyles

  /**
   * The color name, a value from the theme.
   */
  color?: ThemeColor
}

/**
 * A typography element.
 * @param style An extra override style.
 * @param type The type, one of some predefined primary style values.
 * @param variant The variant, one of some predefined secondary style values, overriding type.
 * @param color The color name, a value from the theme.
 * @param children The text content.
 * @param props Additional props passed to the root text element.
 * @constructor
 */
export const Label: FC<LabelProps> = ({ style, type, variant, color, children, ...props }) => {
  // Value reads for named parameters.
  const styleType = type ? labelTypeStyles[type] : labelTypeStyles.regular
  const styleVariant = variant ? labelVariantStyles[variant] : labelVariantStyles.regular
  const styleColor = useThemeColor(color ?? 'text')

  return (
    <Text style={[styleType, styleVariant, styleColor, style]} {...props}>
      {children}
    </Text>
  )
}

/**
 * Label font settings.
 */
export const labelTypeStyles = StyleSheet.create({
  lead: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '100',
  },
  xl: {
    fontSize: 44,
    lineHeight: 58,
    fontWeight: '500',
  },
  h1: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '300',
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: 'normal',
  },
  h3: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 'normal',
  },
  h4: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '400',
  },
  h5: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  },
  h6: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
  },
  caption: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: '600',
    opacity: 0.666,
  },
  compact: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: 'normal',
  },
  regular: {
    fontSize: 14,
    lineHeight: 19,
    fontWeight: 'normal',
  },
  minor: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: 'normal',
  },
  cap: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: 'bold',
  },
  bold: {
    fontWeight: 'bold',
  },
  extraBold: {
    fontWeight: '900',
  },
  lineThrough: {
    textDecorationLine: 'line-through',
  },
  italic: {
    fontStyle: 'italic',
  },
  underlined: {
    textDecorationLine: 'underline',
  },
  para: {
    fontSize: 14,
    fontWeight: 'normal',
    lineHeight: 22,
  },
})

/**
 * Label variant definitions.
 */
export const labelVariantStyles = StyleSheet.create({
  regular: {},
  narrow: {
    fontWeight: '300',
  },
  bold: {
    fontWeight: '900',
  },
  lineThrough: {
    textDecorationLine: 'line-through',
  },
  underlined: {
    textDecorationLine: 'underline',
  },
  middle: {
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  shadow: {
    textShadowColor: '#000000',
    textShadowRadius: 2,
    textShadowOffset: { width: 0.5, height: 1 },
  },
  receded: {
    opacity: 0.666,
  },
})
