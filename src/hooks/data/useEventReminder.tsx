import { useCallback } from 'react'

import { useCache } from '@/context/data/Cache'
import { EventRecord } from '@/context/data/types.api'
import { scheduleEventReminder, cancelEventReminder } from '@/util/eventReminders'

/**
 * Uses event reminder creation, removal, and toggle callbacks, as well as retrieving the
 * current event reminder state.
 */
export const useEventReminder = () => {
  const { getValue, setValue } = useCache()

  // Retrieve timeTravel value from cache, default to 0
  const settings = getValue('settings')
  const offset = settings.timeTravelEnabled ? (settings.timeTravelOffset ?? 0) : 0

  /**
   * Returns true if a notification on the event's record ID is present.
   */
  const checkReminder = useCallback(
    (event: EventRecord) => {
      return Boolean(getValue('notifications')?.find((item) => item.recordId === event.Id))
    },
    [getValue]
  )

  /**
   * Schedules a reminder and saves it to the notifications.
   */
  const createReminder = useCallback(
    async (event: EventRecord) => {
      const notification = await scheduleEventReminder(event, offset)
      const current = getValue('notifications')
      setValue('notifications', [...(current ?? []), notification])
    },
    [getValue, setValue, offset]
  )

  /**
   * Removes a reminder for the event record if present in the currently tracked notifications.
   */
  const removeReminder = useCallback(
    async (event: EventRecord) => {
      const current = getValue('notifications')
      const notification = current?.find((item) => item.recordId === event.Id)
      if (!notification) return
      await cancelEventReminder(notification)
      setValue(
        'notifications',
        current?.filter((item) => item.recordId !== event.Id)
      )
    },
    [getValue, setValue]
  )

  /**
   * If a reminder exists, removes it, otherwise creates one. Returns the mode it used.
   */
  const toggleReminder = useCallback(
    async (event: EventRecord) => {
      if (checkReminder(event)) {
        await removeReminder(event)
        return 'removed'
      } else {
        await createReminder(event)
        return 'added'
      }
    },
    [checkReminder, removeReminder, createReminder]
  )

  return {
    checkReminder,
    createReminder,
    removeReminder,
    toggleReminder,
  }
}
