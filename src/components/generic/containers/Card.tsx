import { FC, PropsWithChildren } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { appStyles } from '@/components/AppStyles'
import { Pressable } from '@/components/generic/Pressable'

type CardProps = PropsWithChildren<{
  onPress?: () => void
  onLongPress?: () => void
  containerStyle?: StyleProp<ViewStyle> | undefined
  style?: StyleProp<ViewStyle> | undefined
}>

export const Card: FC<CardProps> = ({ children, onPress, onLongPress, containerStyle, style }) => {
  const cardStyle = useThemeBackground('background')
  return (
    <Pressable
      containerStyle={containerStyle}
      style={[styles.container, appStyles.shadow, cardStyle, style]}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={onPress === undefined && onLongPress === undefined}
    >
      <View style={styles.main}>{children}</View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 80,
    marginVertical: 15,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  main: {
    flex: 1,
    padding: 16,
  },
})
