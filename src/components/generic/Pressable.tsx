import {
  type StyleProp,
  TouchableOpacity,
  type TouchableOpacityProps,
  type ViewStyle,
} from 'react-native'

import { appStyles } from '@/components/AppStyles'
import { TextSelectionContext } from '@/context/ui/TextSelectionContext'

export type PressableProps = TouchableOpacityProps & {
  containerStyle?: StyleProp<ViewStyle>
}

export function Pressable({
  containerStyle,
  children,
  ...props
}: PressableProps) {
  // Set default accessibility props if not provided
  const accessible = props.accessible !== undefined ? props.accessible : true
  const accessibilityRole = props.accessibilityRole || 'button'

  return (
    <TouchableOpacity
      {...props}
      activeOpacity={props.activeOpacity ?? 0.7}
      style={[appStyles.minTouchSize, containerStyle, props.style]}
      delayLongPress={props.delayLongPress ?? 1000}
      accessible={accessible}
      accessibilityRole={accessibilityRole}
    >
      <TextSelectionContext.Provider value={false}>
        {children}
      </TextSelectionContext.Provider>
    </TouchableOpacity>
  )
}
