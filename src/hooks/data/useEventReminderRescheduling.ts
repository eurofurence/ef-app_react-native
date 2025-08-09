import { isAfter } from 'date-fns'
import { useEffect, useRef } from 'react'
import { useCache } from '@/context/data/Cache'
import { Notification } from '@/store/background/slice'
import { cancelEventReminder, scheduleEventReminder } from '@/util/eventReminders'
import { parseDefaultISO } from '@/util/parseDefaultISO'
import { captureException } from '@sentry/react-native'

/**
 * Synchronizes currently scheduled device notifications with incoming event
 * data. E.g., events may have been deleted or the time changed. The
 * notifications should be updated accordingly.
 */
export function useEventReminderRescheduling() {
  const { events, getValue, setValue } = useCache()

  // Retrieve timeTravel value from cache, default to 0
  const settings = getValue('settings')
  const offset = settings.timeTravelEnabled ? (settings.timeTravelOffset ?? 0) : 0

  const notifications = getValue('notifications')

  const lastPromise = useRef(Promise.resolve())

  useEffect(() => {
    let preempted = false

    lastPromise.current = (async () => {
      // Await the last invocation, there might be changes that still
      // need to be handled.
      await lastPromise.current.catch()

      // Intercepted before it even began, can stop here.
      if (preempted) return

      // Create a new set of notifications that might have been rescheduled.
      const newNotifications: Notification[] = []
      let changed = false

      for (const notification of notifications) {
        // Find the event from the record ID in the reminder data.
        const event = events.dict[notification.recordId]

        // Event is still present. But it might have changed.
        if (event) {
          // Check if changed. If so, reschedule it,
          if (isAfter(parseDefaultISO(event.LastChangeDateTimeUtc), parseDefaultISO(notification.dateCreatedUtc))) {
            // Cancel and reschedule. Add new notification.
            try {
              await cancelEventReminder(notification)
              const newNotification = await scheduleEventReminder(event, offset)
              newNotifications.push(newNotification)
              changed = true
            } catch (error) {
              captureException(error)
            }
          } else {
            // Unchanged, add the old notification.
            newNotifications.push(notification)
          }
        } else {
          // Doesn't exist anymore, remove the reminder and don't add the notification.
          try {
            await cancelEventReminder(notification)
            changed = true
          } catch (error) {
            captureException(error)
          }
        }
      }

      // Only dispatch if changed.
      if (changed) {
        setValue('notifications', newNotifications)
      }
    })()

    return () => {
      preempted = true
    }
  }, [events, notifications, offset, setValue])
}
