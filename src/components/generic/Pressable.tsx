import { StyleProp, TouchableOpacity, TouchableOpacityProps, ViewStyle } from 'react-native'

import { appStyles } from '@/components/AppStyles'

export type PressableProps = TouchableOpacityProps & {
  containerStyle?: StyleProp<ViewStyle>
}

export function Pressable({ containerStyle, ...props }: PressableProps) {
  // Set default accessibility props if not provided
  const accessible = props.accessible !== undefined ? props.accessible : true
  const accessibilityRole = props.accessibilityRole || 'button'

  return (
    <TouchableOpacity
      {...props}
      style={[appStyles.minTouchSize, containerStyle, props.style]}
      delayLongPress={1000}
      accessible={accessible}
      accessibilityRole={accessibilityRole}
    />
  )
}
