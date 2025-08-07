import { StyleProp, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from 'react-native'

export type PressableProps = TouchableOpacityProps & {
  containerStyle?: StyleProp<ViewStyle>
  /**
   * Minimum touch target size for accessibility (defaults to 44)
   */
  minTouchSize?: number
}

export function Pressable({ containerStyle, minTouchSize = 44, ...props }: PressableProps) {
  // Ensure minimum touch target size for accessibility
  const touchableStyle = props.style ? [props.style, { minHeight: minTouchSize, minWidth: minTouchSize }] : { minHeight: minTouchSize, minWidth: minTouchSize }

  // Set default accessibility props if not provided
  const accessible = props.accessible !== undefined ? props.accessible : true
  const accessibilityRole = props.accessibilityRole || 'button'

  return (
    <View style={containerStyle}>
      <TouchableOpacity {...props} style={touchableStyle} delayLongPress={1000} accessible={accessible} accessibilityRole={accessibilityRole} />
    </View>
  )
}
