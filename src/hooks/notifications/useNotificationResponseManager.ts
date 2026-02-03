import { useLastNotificationResponse } from 'expo-notifications'
import { router } from 'expo-router'
import { useEffect } from 'react'

import { conId } from '@/configuration'
import { useCache } from '@/context/data/Cache'
import { useCommunicationsQuery } from '@/hooks/api/communications/useCommunicationsQuery'

/**
 * Handles the last notification response.
 */
export function useNotificationResponseManager() {
  const response = useLastNotificationResponse()
  const { synchronize } = useCache()
  const { refetch } = useCommunicationsQuery()

  // Handle notification responses (when user taps on notification)
  useEffect(() => {
    // Might be null or undefined, skip if not actionable.
    if (!response) return

    // Get data. Skip if content is not present.
    const data = response.notification.request.content.data as Record<
      string,
      any
    >
    if (!data) return

    // Get parts and validate. Skip if not for this convention or if required parts are not present.
    const cid = data.CID
    const event = data.Event
    const relatedId = data.RelatedId
    if (cid !== conId) return
    if (typeof event !== 'string') return
    if (typeof relatedId !== 'string') return

    // Handle announcement notifications, sync before to allow for new data to be loaded before trying to navigate.
    if (event === 'Announcement') {
      synchronize().then(() =>
        router.navigate({
          pathname: '/announcements/[id]',
          params: { id: relatedId },
        })
      )
      return
    }

    // Handle event notifications, sync before navigating.
    if (event === 'Event') {
      synchronize().then(() =>
        router.navigate({
          pathname: '/events/[id]',
          params: { id: relatedId },
        })
      )
      return
    }

    // Handle private message notifications, refetch prior to navigation.
    if (event === 'Notification') {
      refetch().then(() =>
        router.navigate({
          pathname: '/messages/[id]',
          params: { id: relatedId },
        })
      )
      return
    }
  }, [response, synchronize, refetch])

  return null
}
