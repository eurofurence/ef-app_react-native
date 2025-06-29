import { ImageBackground as ExpoImageBackground, ImageBackgroundProps as ExpoImageBackgroundProps } from 'expo-image'
import { forwardRef } from 'react'

export type ImageBackgroundProps = ExpoImageBackgroundProps
export const ImageBackground = forwardRef<typeof ExpoImageBackground, ImageBackgroundProps>((props, ref) => {
  // @ts-expect-error: ref type is not correct
  return <ExpoImageBackground ref={ref} cachePolicy="memory-disk" priority="low" {...props} />
})
ImageBackground.displayName = 'ImageBackground'
