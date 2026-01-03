import {
  ImageBackground as ExpoImageBackground,
  type ImageBackgroundProps as ExpoImageBackgroundProps,
} from 'expo-image'
import { forwardRef } from 'react'
import type { View } from 'react-native'

export type ImageBackgroundProps = ExpoImageBackgroundProps

export const ImageBackground = forwardRef<View, ImageBackgroundProps>(
  (props, _ref) => {
    return (
      <ExpoImageBackground
        cachePolicy='memory-disk'
        priority='low'
        {...props}
      />
    )
  }
)
ImageBackground.displayName = 'ImageBackground'
