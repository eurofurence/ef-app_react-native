import * as Sentry from '@sentry/react-native'

export const captureNotificationException = (message: string, error: Error) => {
    console.error(message, error)

    Sentry.captureException(error, {
        tags: {
            type: 'notifications',
        },
    })
}
