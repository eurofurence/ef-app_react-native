import { addNotificationResponseReceivedListener } from 'expo-notifications'
import { router } from 'expo-router'

import { captureNotificationException } from '@/sentryHelpers'

// Import globally at index, this code runs the method on import.

// Set up notification response handling for when users tap on notifications.
addNotificationResponseReceivedListener((response) => {
  try {
    const { notification } = response
    const { request } = notification
    const { content, identifier } = request

    // Handle announcement notifications
    // Check by channel identifier first, then fallback to content data
    if (identifier === 'announcements' || content?.categoryIdentifier === 'announcements' || content?.data?.type === 'announcement' || content?.data?.channel === 'announcements') {
      // Try multiple possible fields for the announcement ID
      const announcementId = content?.data?.id || content?.data?.announcementId || content?.data?.announcement_id || content?.data?.recordId

      if (announcementId && typeof announcementId === 'string') {
        // Navigate to the specific announcement
        router.navigate({
          pathname: '/announcements/[id]',
          params: { id: announcementId },
        })
        return
      }
    }

    // Handle other notification types here as needed
    // For now, any unhandled notifications will fall through to default behavior
  } catch (error) {
    // Log error but don't crash the app
    captureNotificationException('Failed to handle notification response', error instanceof Error ? error : new Error(String(error)))
  }
})
