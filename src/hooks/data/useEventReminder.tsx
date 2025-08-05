import { useCallback } from 'react'
import { scheduleEventReminder, cancelEventReminder } from '@/util/eventReminders'
import { Notification } from '@/store/background/slice'
import { EventRecord } from '@/context/data/types.api'
import { useCache } from '@/context/data/Cache'

/**
 * Uses event reminder creation, removal, and toggle callbacks, as well as retrieving the
 * current event reminder state.
 */
export const useEventReminder = () => {
  const { getValue, setValue } = useCache()

  // Retrieve timeTravel value from cache, default to 0
  const settings = getValue('settings')
  const offset = settings.timeTravelEnabled ? (settings.timeTravelOffset ?? 0) : 0

  const save = useCallback(
    (notification: Notification) => setValue('notifications', [...(getValue('notifications')?.filter((item) => item.recordId !== notification.recordId) ?? []), notification]),
    [getValue, setValue]
  )

  const remove = useCallback(
    (id: string) => {
      setValue('notifications', getValue('notifications')?.filter((item) => item.recordId !== id) ?? [])
    },
    [getValue, setValue]
  )

  const checkReminder = useCallback((event: EventRecord) => Boolean(getValue('notifications')?.find((item) => item.recordId === event.Id)), [getValue])
  const createReminder = useCallback((event: EventRecord) => scheduleEventReminder(event, offset, save), [offset, save])
  const removeReminder = useCallback((event: EventRecord) => cancelEventReminder(event.Id, remove), [remove])
  const toggleReminder = useCallback(
    async (event: EventRecord) => {
      if (checkReminder(event)) {
        await cancelEventReminder(event, remove)
        return 'removed'
      } else {
        await scheduleEventReminder(event, offset, save)
        return 'added'
      }
    },
    [checkReminder, remove, offset, save]
  )

  return {
    checkReminder,
    createReminder,
    removeReminder,
    toggleReminder,
  }
}
