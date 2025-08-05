import { StyleProp, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from 'react-native'

export type PressableProps = TouchableOpacityProps & {
  containerStyle?: StyleProp<ViewStyle>
}

export function Pressable({ containerStyle, ...props }: PressableProps) {
  return (
    <View style={containerStyle}>
      <TouchableOpacity {...props} delayLongPress={1000} />
    </View>
  )
}
