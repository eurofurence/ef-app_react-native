import { isAfter } from 'date-fns'
import { useEffect, useRef } from 'react'
import { useCache } from '@/context/data/Cache'
import { Notification } from '@/store/background/slice'
import { cancelEventReminder, rescheduleEventReminder } from '@/util/eventReminders'
import { parseDefaultISO } from '@/util/parseDefaultISO'

/**
 * Synchronizes currently scheduled device notifications with incoming event
 * data. E.g., events may have been deleted or the time changed. The
 * notifications should be updated accordingly.
 */
export function useEventReminderRescheduling() {
  const { events, getValue, setValue } = useCache()
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

      // Start creating an updated notifications list.
      const newNotifications = [...notifications]
      let changed = false

      // Add value to the `newNotifications` array.
      const add = (notification: Notification) => {
        newNotifications.push(notification)
        changed = true
      }

      // Remove from the `newNotifications` array by ID.
      const remove = (id: string) => {
        const index = newNotifications.findIndex((item) => item.recordId === id)
        if (index >= 0) newNotifications.splice(index, 1)
        changed = true
      }

      for (const notification of notifications) {
        // Find the event from the record ID in the reminder data.
        const event = events.dict[notification.recordId]

        // Event is still present. But it might have changed.
        if (event) {
          // Check if changed. If so, reschedule it,
          if (isAfter(parseDefaultISO(event.LastChangeDateTimeUtc), parseDefaultISO(notification.dateCreatedUtc))) {
            await rescheduleEventReminder(event, 0, add, remove).catch((error) => console.warn('Reschedule error:', error))
          }
        } else {
          // Doesn't exist anymore, remove the reminder.
          await cancelEventReminder(notification.recordId, remove).catch((error) => console.warn('Cancel reminder error:', error))
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
  }, [events, notifications, setValue])
}
