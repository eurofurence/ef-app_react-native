import { router } from 'expo-router'
import * as React from 'react'
import { StyleSheet } from 'react-native'

import { Pressable } from '@/components/generic/Pressable'
import { ImageDetails } from '@/context/data/types.details'

import { Image, ImageProps } from './Image'
import { sourceFromImage } from './Image.common'

export type BannerProps = {
  /**
   * The style button.
   */
  style?: ImageProps['style']

  /**
   * The source image object.
   */
  image?: ImageDetails

  /**
   * The viewer title.
   */
  title?: string

  /**
   * Placeholder to use.
   */
  placeholder?: ImageProps['placeholder']

  /**
   * If true, this image can be opened and viewed.
   */
  viewable?: boolean
}

export const Banner = ({ style, image, title, placeholder, viewable }: BannerProps) => {
  const aspect = !image ? {} : { aspectRatio: image.Width / image.Height }
  // Do not render if nothing given.
  if (!image) return null
  return (
    <Pressable
      containerStyle={styles.container}
      disabled={!viewable}
      onPress={() => {
        if (viewable && image)
          router.navigate({
            pathname: '/images/[id]',
            params: { id: image.Id, title },
          })
      }}
    >
      <Image style={[styles.image, aspect, style]} contentFit={undefined} source={sourceFromImage(image)} placeholder={placeholder} />
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: undefined,
  },
  image: {
    width: '100%',
    height: undefined,
  },
})
