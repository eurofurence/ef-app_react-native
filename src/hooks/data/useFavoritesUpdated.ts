import { useCallback, useMemo } from 'react'
import { useCache } from '@/context/data/Cache'

/**
 * Uses the state of user favorite events and dealers. Also returns the last
 * viewed times as a record of ID to formatted time.
 */
export function useFavoritesUpdated() {
  const { events, dealers, getValue, setValue } = useCache()

  const notifications = getValue('notifications')
  const settings = getValue('settings')

  const favoriteEvents = useMemo(() => events.filter((item) => notifications?.find((notification) => notification.recordId === item.Id)), [events, notifications])

  const favoriteDealers = useMemo(() => dealers.filter((item) => settings.favoriteDealers?.includes(item.Id)), [dealers, settings])

  const lastViewTimes = settings.lastViewTimes

  const clear = useCallback(() => {
    const settings = getValue('settings')
    setValue('settings', {
      ...settings,
      lastViewTimes: {},
    })
  }, [getValue, setValue])

  return {
    favoriteEvents,
    favoriteDealers,
    lastViewTimes,
    clear,
  }
}
