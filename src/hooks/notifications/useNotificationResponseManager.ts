import {
  clearLastNotificationResponse,
  useLastNotificationResponse,
} from 'expo-notifications'
import { router } from 'expo-router'
import { useEffect, useRef } from 'react'

import { conId } from '@/configuration'
import { SyncSupersededError, useCache } from '@/context/data/Cache'
import { useCommunicationsQuery } from '@/hooks/api/communications/useCommunicationsQuery'
import { captureNotificationException } from '@/sentryHelpers'

/**
 * Handles the last notification response.
 */
export function useNotificationResponseManager() {
  const response = useLastNotificationResponse()
  const { synchronize } = useCache()
  const { refetch } = useCommunicationsQuery()

  const refSync = useRef(synchronize)
  const refRefetch = useRef(refetch)
  refSync.current = synchronize
  refRefetch.current = refetch

  useEffect(() => {
    // Skip handling no response.
    if (!response) return

    // Clear state.
    clearLastNotificationResponse()

    ;(async () => {
      // Get data. Skip if content is not present.
      console.log('received notification', JSON.stringify(response, null, 2))
      const data = response.notification.request.content.data
      if (!data) return

      // Parse and validate data.
      const cid = data.CID
      const event = data.Event
      const relatedId = data.RelatedId
      if (cid !== conId) return
      if (typeof event !== 'string') return
      if (typeof relatedId !== 'string') return

      // Dispatch on type. Always propagate exception, always navigate.
      if (event === 'Announcement') {
        await refSync.current().finally(() =>
          router.navigate({
            pathname: '/announcements/[id]',
            params: { id: relatedId },
          })
        )
      } else if (event === 'Event') {
        await refSync.current().finally(() =>
          router.navigate({
            pathname: '/events/[id]',
            params: { id: relatedId },
          })
        )
      } else if (event === 'Notification') {
        await refRefetch.current().finally(() =>
          router.navigate({
            pathname: '/messages/[id]',
            params: { id: relatedId },
          })
        )
      }
    })().catch((error) => {
      // A superseded run is replaced by one that does apply the data.
      if (error instanceof SyncSupersededError) return
      captureNotificationException(
        `Fetching data for the notification failed`,
        error
      )
    })
  }, [response])

  return null
}
