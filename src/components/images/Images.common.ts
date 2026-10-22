import { Dimensions } from 'react-native'

import { shareLink } from '@/util/shareLink'

export const shareImage = (url: string, title: string) => shareLink(title, url)

export const minZoomFor = (width: number, height: number, padding: number) => {
  if (width <= 0 || height <= 0) return 1
  const dims = Dimensions.get('window')
  return Math.min(
    (dims.width - 2 * padding) / width,
    (dims.height + 2 * padding) / height
  )
}
