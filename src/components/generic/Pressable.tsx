import { StyleProp, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from 'react-native'

export type PressableProps = TouchableOpacityProps & {
  containerStyle?: StyleProp<ViewStyle>
}

export function Pressable({ containerStyle, ...props }: PressableProps) {
  return <TouchableOpacity {...props} style={[containerStyle, props.style]} delayLongPress={1000} />
}
