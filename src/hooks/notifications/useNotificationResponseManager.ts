import { useLastNotificationResponse } from 'expo-notifications'
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
  const handled = useRef<string | null>(null)

  // Handle notification responses (when user taps on notification)
  useEffect(() => {
    // Might be null or undefined, skip if not actionable.
    if (!response) {
      handled.current = null
      return
    }

    // The effect also re-runs when the fetchers change identity, which auth
    // hydration does mid-tap. One tap must still navigate exactly once.
    const identifier = response.notification.request.identifier
    if (handled.current === identifier) return
    handled.current = identifier

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

    // Fetch first so the target has its data, but navigate either way. A tap
    // must always land somewhere; the target renders its own pending state
    // while a later fetch catches up.
    const fetchThenNavigate = (
      fetch: () => Promise<unknown>,
      navigate: () => void
    ) => {
      fetch()
        .catch((error) => {
          // A superseded run is replaced by one that does apply the data.
          if (error instanceof SyncSupersededError) return
          captureNotificationException(
            `Fetching data for the ${event} notification failed`,
            error
          )
        })
        .finally(navigate)
    }

    if (event === 'Announcement') {
      fetchThenNavigate(synchronize, () =>
        router.navigate({
          pathname: '/announcements/[id]',
          params: { id: relatedId },
        })
      )
      return
    }

    if (event === 'Event') {
      fetchThenNavigate(synchronize, () =>
        router.navigate({
          pathname: '/events/[id]',
          params: { id: relatedId },
        })
      )
      return
    }

    if (event === 'Notification') {
      fetchThenNavigate(refetch, () =>
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
