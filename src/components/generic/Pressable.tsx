import { StyleProp, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'

export type PressableProps = TouchableOpacityProps & {
  containerStyle?: StyleProp<ViewStyle>
  /**
   * Minimum touch target size for accessibility (defaults to 44)
   */
  minTouchSize?: number
}

export function Pressable({ containerStyle, minTouchSize = 44, ...props }: PressableProps) {
  // Set default accessibility props if not provided
  const accessible = props.accessible !== undefined ? props.accessible : true
  const accessibilityRole = props.accessibilityRole || 'button'

  return <TouchableOpacity {...props} style={[containerStyle, props.style]} delayLongPress={1000} accessible={accessible} accessibilityRole={accessibilityRole} />
}
