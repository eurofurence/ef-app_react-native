import { setNotificationHandler } from 'expo-notifications'

import { captureNotificationException } from '@/sentryHelpers'

// Import globally at index, this code runs the method on import.

// Set general notification handling strategy.
setNotificationHandler({
  handleNotification: async ({ request: { content } }) => {
    // Show if it's a notification trigger.
    const displayable = typeof content?.title === 'string' || typeof content?.body === 'string'
    return {
      shouldShowBanner: displayable,
      shouldShowList: displayable,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }
  },
  handleSuccess: () => {
    // Nothing.
  },
  handleError: (id, error) => {
    // Log error.
    captureNotificationException(`Handling notification failed, assigned ID: ${id}`, error)
  },
})
