import * as React from 'react'
import { FC } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { Icon, IconNames } from './Icon'
import { ThemeColor } from '@/context/Theme'
import { useTheme } from '@/hooks/themes/useThemeHooks'

export type MarkerProps = {
  style?: StyleProp<ViewStyle>
  markerColor?: ThemeColor
  markerType?: IconNames
  markerSize?: number
}

export const Marker: FC<MarkerProps> = ({ style, markerColor = 'marker', markerType = 'map-marker', markerSize = 40 }) => {
  const theme = useTheme()
  const color = markerColor in theme ? theme[markerColor] : markerColor

  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        <Icon style={styles.shadow} name={markerType} color={theme.darken} size={markerSize} />
        <Icon style={styles.marker} name={markerType} color={color} size={markerSize} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: 0,
    height: 0,
    alignItems: 'center',
  },
  content: {
    position: 'absolute',
    bottom: 0,
  },
  marker: {},
  shadow: {
    position: 'absolute',
    transform: [{ translateX: 2 }, { translateY: 2 }],
  },
})
