import * as React from 'react'
import { FC } from 'react'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { IconNames } from '../atoms/Icon'
import { ImageFill, ImageFillProps } from '../atoms/ImageFill'
import { Marker } from '../atoms/Marker'
import { useThemeBackground } from '@/hooks/themes/useThemeHooks'
import { ThemeColor } from '@/context/Theme'

/**
 * Arguments to the button.
 */
export type ImageButtonProps = {
  containerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>

  /**
   * The source image object.
   */
  image: ImageFillProps['image']

  /**
   * The targeted point and the dimension to make visible.
   */
  target: ImageFillProps['target']

  /**
   * True if no indicator should be displayed.
   */
  noMarker?: boolean
  markerColor?: ThemeColor
  markerType?: IconNames
  markerSize?: number

  /**
   * If given, invoked on button press.
   */
  onPress?: () => void

  /**
   * If given, invoked on long press.
   */
  onLongPress?: () => void
}

export const ImageExButton: FC<ImageButtonProps> = ({ containerStyle, style, image, target, noMarker = false, markerColor, markerType, markerSize, onPress, onLongPress }) => {
  const styleBackground = useThemeBackground('background')

  return (
    <TouchableOpacity containerStyle={containerStyle} style={[styles.container, styleBackground, style]} onPress={onPress} onLongPress={onLongPress}>
      {!target || !image ? null : <ImageFill image={image} target={target} />}
      {noMarker ? null : <Marker style={styles.marker} markerColor={markerColor} markerType={markerType} markerSize={markerSize} />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    minHeight: 160,
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    left: '50%',
    top: '50%',
  },
})
