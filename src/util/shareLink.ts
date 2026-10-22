import { captureException } from '@sentry/react-native'
import { Platform, Share } from 'react-native'

import { conAbbr } from '@/configuration'

/**
 * Shares a titled link. Android's share sheet ignores the `url` field, so the
 * link has to be inlined into the message there; on the other platforms it is
 * passed separately to keep the preview rich and avoid printing it twice.
 */
export const shareLink = (title: string, url: string) => {
  const message = `Check out ${title} on ${conAbbr}!`
  return Share.share(
    Platform.OS === 'android'
      ? { title, message: `${message}\n${url}` }
      : { title, message, url },
    {}
  ).catch(captureException)
}
