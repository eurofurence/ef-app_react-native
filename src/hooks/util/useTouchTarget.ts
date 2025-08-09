import { useMemo } from 'react'
import { ViewStyle } from 'react-native'

/**
 * Hook to ensure minimum touch target sizes for accessibility
 * @param minSize Minimum touch target size (default: 44)
 * @param style Optional existing style object to merge with touch target styles
 * @returns Style object with minimum touch target sizes
 */
export const useTouchTarget = (minSize: number = 44, style?: ViewStyle | ViewStyle[]): ViewStyle | ViewStyle[] => {
  return useMemo(() => {
    const baseStyle: ViewStyle = {
      minHeight: minSize,
      minWidth: minSize,
      justifyContent: 'center',
      alignItems: 'center',
    }

    // If style is provided, merge it with the base touch target style
    if (style) {
      if (Array.isArray(style)) {
        return [baseStyle, ...style]
      } else {
        return [baseStyle, style]
      }
    }

    return baseStyle
  }, [minSize, style])
}

/**
 * Hook specifically for eye tracking compatibility (60x60 points minimum)
 * @param style Optional existing style object to merge with touch target styles
 * @returns Style object with minimum touch target sizes for eye tracking
 */
export const useEyeTrackingTarget = (style?: ViewStyle | ViewStyle[]): ViewStyle | ViewStyle[] => {
  return useTouchTarget(60, style)
}
