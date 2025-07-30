import { captureException } from '@sentry/react-native'

export const captureNotificationException = (message: string, error: Error) => {
  console.error(message, error)

  captureException(error, {
    tags: {
      type: 'notifications',
    },
  })
}
