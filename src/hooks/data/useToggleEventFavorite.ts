import { captureException } from '@sentry/react-native'
import { useCallback } from 'react'

import type { EventDetails } from '@/context/data/types.details'
import { useAuthState } from '@/data/clients/auth'
import {
  pushFavoriteEvent,
  removeFavoriteEvent,
} from '@/data/clients/favoritesSync'
import { favoriteEventsCollection } from '@/data/collections/FavoriteEvents'
import { useEventReminder } from '@/hooks/data/useEventReminder'

/**
 * Toggles an event favourite: updates the favourite collection, keeps the
 * reminder in lockstep (deduped), and syncs to the backend when signed in.
 */
export function useToggleEventFavorite() {
  const { isLoggedIn } = useAuthState()
  const { checkReminder, createReminder, removeReminder } = useEventReminder()

  return useCallback(
    async (event: EventDetails): Promise<'added' | 'removed'> => {
      if (event.Favorite) {
        favoriteEventsCollection.delete(event.Id)
        if (isLoggedIn) removeFavoriteEvent(event.Id).catch(captureException)
        await removeReminder(event).catch(captureException)
        return 'removed'
      }
      favoriteEventsCollection.insert({ Id: event.Id })
      if (isLoggedIn) pushFavoriteEvent(event.Id).catch(captureException)
      if (!checkReminder(event)) {
        await createReminder(event).catch(captureException)
      }
      return 'added'
    },
    [isLoggedIn, checkReminder, createReminder, removeReminder]
  )
}
