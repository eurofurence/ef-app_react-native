import { useMemo } from 'react'
import { DimensionValue, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { ThemeColor, withAlpha } from '@/context/Theme'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'

/**
 * Props for the progress indicator.
 */
export type ProgressProps = {
  /**
   * Style passed to root.
   */
  style?: StyleProp<ViewStyle>

  /**
   * The value to show at between zero and one.
   */
  value: number

  /**
   * Foreground color.
   */
  color?: ThemeColor
}

export const Progress = ({ style, value, color = 'secondary' }: ProgressProps) => {
  // Convert theme into style.
  const colorStyle = useThemeBackground(color)

  return (
    <View style={[styles.container, { backgroundColor: withAlpha(colorStyle.backgroundColor, 0.25) }, style]}>
      <View style={[styles.bar, colorStyle, { width: `${(value * 100).toFixed(0)}%` as DimensionValue }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignSelf: 'stretch',
    height: 4,
  },
  bar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
})
