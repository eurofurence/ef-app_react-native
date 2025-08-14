import { captureException } from '@sentry/react-native'
import { Dimensions, Share } from 'react-native'

import { conAbbr } from '@/configuration'

export const shareImage = (url: string, title: string) =>
  Share.share(
    {
      title,
      url,
      message: `Check out ${title} on ${conAbbr}!\n${url}`,
    },
    {}
  ).catch(captureException)

export const minZoomFor = (width: number, height: number, padding: number) => {
  if (width <= 0 || height <= 0) return 1
  const dims = Dimensions.get('window')
  return Math.min((dims.width - 2 * padding) / width, (dims.height + 2 * padding) / height)
}
