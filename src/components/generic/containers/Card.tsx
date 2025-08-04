import { FC, PropsWithChildren } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Pressable } from '@/components/generic/Pressable'

import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { appStyles } from '@/components/AppStyles'

type CardProps = PropsWithChildren<{
  onPress?: () => void
  onLongPress?: () => void
  style?: StyleProp<ViewStyle> | undefined
}>

export const Card: FC<CardProps> = ({ children, onPress, onLongPress, style }) => {
  const cardStyle = useThemeBackground('background')
  return (
    <Pressable
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
    flexDirection: 'row',
  },
  main: {
    flex: 1,
    padding: 16,
  },
})
