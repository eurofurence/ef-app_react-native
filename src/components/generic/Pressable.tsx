// import { Pressable as RNGHPressable, PressableProps as RNGHPressableProps } from 'react-native'
import { Pressable as RNGHPressable, PressableProps as RNGHPressableProps } from 'react-native-gesture-handler'
import { StyleProp, ViewStyle } from 'react-native'

const defaultActiveOpacity = 0.5

export type PressableProps = Omit<RNGHPressableProps, 'style'> & {
  activeOpacity?: number
  style?: StyleProp<ViewStyle>
}

export function Pressable({ activeOpacity, style, ...rest }: PressableProps) {
  return <RNGHPressable style={({ pressed }) => [{ opacity: 1.0 }, style, pressed && { opacity: activeOpacity ?? defaultActiveOpacity }]} {...rest} />
}
