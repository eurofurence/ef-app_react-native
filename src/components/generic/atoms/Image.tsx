import {
  Image as ExpoImage,
  type ImageProps as ExpoImageProps,
} from 'expo-image'
import { forwardRef } from 'react'

export type ImageProps = ExpoImageProps
export const Image = forwardRef<ExpoImage, ImageProps>((props, ref) => {
  return (
    <ExpoImage ref={ref} cachePolicy='memory-disk' priority='low' {...props} />
  )
})
Image.displayName = 'Image'
