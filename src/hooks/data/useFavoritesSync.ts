import { captureException } from '@sentry/react-native'
import { useCallback } from 'react'

import { useCache } from '@/context/data/Cache'
import {
  clearLocalFavoriteEvents,
  mergeFavoriteEvents,
} from '@/data/clients/favoritesSync'
import { useEventReminder } from '@/hooks/data/useEventReminder'
import { cancelEventReminder } from '@/util/eventReminders'

/**
 * Sync helpers that keep favourites and their reminders consistent.
 * - mergeFavorites: union-merge with the backend, then schedule reminders for
 *   newly pulled favourites that don't already have one (deduped).
 * - clearLocalFavorites: cancel favourite reminders and clear the collection.
 *   Local only, never touches the backend.
 */
export function useFavoritesSync() {
  const cache = useCache()
  const { checkReminder, createReminder } = useEventReminder()

  const mergeFavorites = useCallback(async () => {
    const { pulled } = await mergeFavoriteEvents()
    for (const id of pulled) {
      const event = cache.events.dict[id]
      if (event && !checkReminder(event)) {
        await createReminder(event).catch(captureException)
      }
    }
  }, [cache, checkReminder, createReminder])

  const clearLocalFavorites = useCallback(async () => {
    const notifications = cache.getValue('notifications') ?? []
    const reminders = notifications.filter((n) => n.type === 'EventReminder')
    await Promise.all(reminders.map((n) => cancelEventReminder(n)))
    cache.setValue(
      'notifications',
      notifications.filter((n) => n.type !== 'EventReminder')
    )
    clearLocalFavoriteEvents()
  }, [cache])

  return { mergeFavorites, clearLocalFavorites }
}
